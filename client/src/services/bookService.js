import axios from 'axios';

// IMPORTANT: Update this URL to your Render backend URL
const API_URL = "https://readerreviews.onrender.com";

export const fetchBooks = async (page = 1) => {
  const res = await axios.get(`${API_URL}/api/books?page=${page}`);
  return res.data;
};

export const fetchBookById = async (id) => {
  const res = await axios.get(`${API_URL}/api/books/${id}`);
  return res.data;
};

export const addBook = async (bookData, token) => {
  const res = await axios.post(`${API_URL}/api/books`, bookData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
