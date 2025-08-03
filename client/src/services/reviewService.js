import axios from 'axios';

// IMPORTANT: Update this URL to your Render backend URL
const API_URL = "https://readerreviews.onrender.com";

export const getReviews = async (bookId) => {
  const res = await axios.get(`${API_URL}/api/reviews/${bookId}`);
  return res.data;
};

export const submitReview = async (bookId, data, token) => {
  const res = await axios.post(`${API_URL}/api/reviews/${bookId}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteReview = async (reviewId, token) => {
  const res = await axios.delete(`${API_URL}/api/reviews/${reviewId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}