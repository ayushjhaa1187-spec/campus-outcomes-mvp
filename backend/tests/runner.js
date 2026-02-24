const fs = require('fs');
const path = require('path');

const testDir = __dirname;
const files = fs.readdirSync(testDir).filter(f => f.startsWith('test_') && f.endsWith('.js'));

(async () => {
  let hasFailure = false;
  for (const file of files) {
    console.log(`Running ${file}...`);
    try {
      const testModule = require(path.join(testDir, file));
      if (typeof testModule === 'function') {
        await testModule();
      } else if (typeof testModule.run === 'function') {
        await testModule.run();
      } else {
        console.warn(`Skipping ${file}: No run function or default export found.`);
      }
      console.log(`PASS: ${file}`);
    } catch (err) {
      hasFailure = true;
      console.error(`FAIL: ${file}`);
      console.error(err);
    }
  }

  if (hasFailure) {
    process.exit(1);
  } else {
    console.log('All tests passed!');
  }
})();
