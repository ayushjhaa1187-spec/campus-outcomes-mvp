// Replace with your actual backend URL after deployment
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : 'https://campus-outcomes-backend.vercel.app/api';

const apiCall = async (endpoint, method = 'GET', body = null) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
  
  const options = {
    method,
    headers
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'API request failed');
    }
    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

const login = async (email, password) => {
  const data = await apiCall('/auth/login', 'POST', { email, password });
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
};

const register = async (email, password, name, collegeName) => {
  const data = await apiCall('/auth/register', 'POST', { email, password, name, collegeName });
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
};

const getHealthCheck = () => apiCall('/health');

// Placement API
const getPlacements = () => apiCall('/placements');

const addPlacement = (placementData) => apiCall('/placements', 'POST', placementData);

const updatePlacement = (id, placementData) => apiCall(`/placements/${id}`, 'PUT', placementData);

const deletePlacement = (id) => apiCall(`/placements/${id}`, 'DELETE');

// College API
const getCollegeDetails = () => apiCall('/colleges');

// Export functions to window for global access in simple HTML
window.api = {
  login,
  register,
  getHealthCheck,
  getPlacements,
  addPlacement,
  updatePlacement,
  deletePlacement,
  getCollegeDetails
};
