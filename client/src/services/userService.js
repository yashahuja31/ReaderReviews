import axios from 'axios';

const API_URL = "http://localhost:5000/api/users";

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
