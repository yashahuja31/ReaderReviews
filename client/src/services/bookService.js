import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

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
