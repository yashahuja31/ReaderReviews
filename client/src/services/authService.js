import axios from 'axios';

const API_URL  = import.meta.env.VITE_API_URL;

// Login user
export const loginUser = async (email, password) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data;
};

// Register user
export const registerUser = async (name, email, password) => {
  const res = await axios.post(`${API_URL}/register`, { name, email, password });
  return res.data;
};
