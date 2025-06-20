import Book from '../models/book.js';

export const getAllBooks = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const books = await Book.find().skip(skip).limit(limit);
  const total = await Book.countDocuments();

  res.json({ books, page, totalPages: Math.ceil(total / limit) });
};

export const getBookById = async (req, res) => {
  const bookId = req.params.id;
  if (!bookId) return res.status(400).json({ message: "Book ID is required" });

  const book = await Book.findById(bookId);
  if (!book) return res.status(404).json({ message: "Book not found" });

  res.json(book);
};

export const addBook = async (req, res) => {
  const { title, author, genre, description, coverImage } = req.body;

  const book = new Book({ title, author, genre, description, coverImage });
  const savedBook = await book.save();

  res.status(201).json(savedBook);
};
