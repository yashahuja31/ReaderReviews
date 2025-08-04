import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Login a user
export const loginUser = async (email, password) => {
  const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
  return res.data;
};

//Register a new user
export const registerUser = async (name, email, password) => {
  const res = await axios.post(`${API_URL}/api/auth/register`, { name, email, password });
  return res.data;
};
