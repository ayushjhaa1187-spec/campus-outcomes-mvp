/**
 * In-memory rate limiter middleware with memory management and standard headers.
 * Note: This works per-process. In a multi-instance deployment,
 * a distributed store like Redis would be required.
 */

const createRateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes default
    max = 100, // Limit each IP to 100 requests per windowMs
    message = 'Too many requests from this IP, please try again after some time',
    statusCode = 429
  } = options;

  const requests = new Map();

  /**
   * Periodic cleanup to prevent memory leaks from expired entries.
   * We use an unref'd timer if possible to avoid keeping the process alive
   * in some environments, though Express usually keeps it alive anyway.
   */
  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of requests.entries()) {
      if (now > data.resetTime) {
        requests.delete(ip);
      }
    }
  }, windowMs);

  // Try to unref the timer if in Node.js to be environment-friendly
  if (cleanup.unref) {
    cleanup.unref();
  }

  return (req, res, next) => {
    // Express's req.ip is reliable if 'trust proxy' is enabled
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const now = Date.now();

    let rateData = requests.get(ip);

    // If no data or window expired, reset
    if (!rateData || now > rateData.resetTime) {
      rateData = {
        count: 0,
        resetTime: now + windowMs
      };
      requests.set(ip, rateData);
    }

    // Increment count
    rateData.count++;

    // Set standard rate limit headers
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - rateData.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(rateData.resetTime / 1000));

    // Check if limit exceeded
    if (rateData.count > max) {
      return res.status(statusCode).json({
        error: message,
        retryAfter: Math.ceil((rateData.resetTime - now) / 1000)
      });
    }

    next();
  };
};

// General rate limiter: 100 requests per 15 minutes
const generalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later'
});

// Strict rate limiter for auth: 5 requests per 15 minutes
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login/register attempts, please try again after 15 minutes'
});

module.exports = {
  generalLimiter,
  authLimiter
};
