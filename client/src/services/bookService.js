import axios from 'axios';

export const fetchBooks = async (page = 1) => {
  const res = await axios.get(`/api/books?page=${page}`);
  return res.data;
};

export const fetchBookById = async (id) => {
  const res = await axios.get(`/api/books/${id}`);
  return res.data;
};

export const addBook = async (bookData, token) => {
  const res = await axios.post('/api/books', bookData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
