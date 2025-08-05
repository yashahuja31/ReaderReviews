import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

export const fetchBooks = async (page = 1) => {
  try {
    const res = await axios.get(`${API_URL}/api/books?page=${page}`)
    return res.data;
  } catch (err) {
    console.error("Error fetching books:", err);
    throw err;
  }
};

export const fetchBookById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/api/books/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching book by ID:", err);
    throw err;
  }
};

export const addBook = async (bookData, token) => {
  try {
    const res = await axios.post(`${API_URL}/api/books`, bookData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    console.error("Error adding book:", err);
    throw err;
  }
};
