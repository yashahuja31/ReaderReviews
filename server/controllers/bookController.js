import Book from '../models/book.js';

export const getAllBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const books = await Book.find().skip(skip).limit(limit);
    const total = await Book.countDocuments();

    res.json({ books, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("Error in getAllBooks:", err);
    res.status(500).json({ message: "Server error fetching books" });
  }
};

export const getBookById = async (req, res) => {
  try {
    const bookId = req.params.id;
    if (!bookId) return res.status(400).json({ message: "Book ID is required" });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    res.json(book);
  } catch (err) {
    console.error("Error in getBookById:", err);
    res.status(500).json({ message: "Server error fetching book" });
  }
};

export const addBook = async (req, res) => {
  try {
    const { title, author, genre, description, coverImage } = req.body;

    const book = new Book({ title, author, genre, description, coverImage });
    const savedBook = await book.save();

    res.status(201).json(savedBook);
  } catch (err) {
    console.error("Error in addBook:", err);
    res.status(500).json({ message: "Server error adding book" });
  }
};
