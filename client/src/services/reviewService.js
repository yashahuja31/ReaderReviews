import axios from 'axios';

export const getReviews = async (bookId) => {
  const res = await axios.get(`/api/reviews/${bookId}`);
  return res.data;
};

export const submitReview = async (bookId, data, token) => {
  const res = await axios.post(`/api/reviews/${bookId}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
