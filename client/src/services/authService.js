import axios from 'axios';

// IMPORTANT: Update this URL to your Render backend URL
const API_URL = "https://readerreviews.onrender.com/api/auth";

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
