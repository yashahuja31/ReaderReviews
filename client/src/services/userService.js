import axios from 'axios';

// IMPORTANT: Update this URL to your Render backend URL
const API_URL = "https://readerreviews.onrender.com/api/users";

export const getUserProfile = async (token) => {
  const { data } = await axios.get(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const updateUserProfile = async (userData, token) => {
  const { data } = await axios.put(`${API_URL}/profile`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const markBookAsRead = async (bookId, token) => {
  const { data } = await axios.post(`${API_URL}/read/${bookId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
