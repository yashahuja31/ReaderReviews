import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getUserProfile = async (token) => {
  const res = await axios.get(`${API_URL}/api/users/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateUserProfile = async (userData, token) => {
  const res = await axios.put(`${API_URL}/api/users/profile`, userData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const markBookAsRead = async (bookId, token) => {
  const res = await axios.post(`${API_URL}/api/users/read/${bookId}`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
