const API_BASE_URL = 'http://localhost:5000/api';

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
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  return response.json();
};

const login = async (email, password) => {
  const data = await apiCall('/auth/login', 'POST', { email, password });
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
};

const register = async (email, password, name, collegeName) => {
  const data = await apiCall('/auth/register', 'POST', { email, password, name, collegeName });
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
};

const getHealthCheck = () => apiCall('/health');
