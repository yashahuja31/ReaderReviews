import Book from '../models/book.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // Fetch books from MongoDB
    const dbBooks = await Book.find().skip(skip).limit(limit);
    const total = await Book.countDocuments();
    
    // Fetch books from local JSON file
    let localBooks = [];
    try {
      const jsonPath = path.resolve(__dirname, '../book-data.json');
      const fileContent = fs.readFileSync(jsonPath, 'utf8');
      // Extract the array from the JavaScript file format
      const match = fileContent.match(/const\s+realBooksData\s*=\s*(\[[\s\S]*\]);/);
      if (match && match[1]) {
        // Use eval to parse the JavaScript array (safe in this controlled context)
        // eslint-disable-next-line no-eval
        localBooks = eval(match[1]);
      }
    } catch (fileErr) {
      console.error("Error reading local book data:", fileErr);
    }
    
    // Combine books from both sources
    // Use a Map to avoid duplicates based on _id
    const booksMap = new Map();
    
    // Add MongoDB books
    dbBooks.forEach(book => {
      booksMap.set(book._id.toString(), book);
    });
    
    // Add local books (if not already in the map)
    if (localBooks && Array.isArray(localBooks)) {
      localBooks.forEach(book => {
        if (book._id && !booksMap.has(book._id)) {
          booksMap.set(book._id, book);
        }
      });
    }
    
    // Convert map back to array
    const combinedBooks = Array.from(booksMap.values());
    
    // Apply pagination to combined results
    const paginatedBooks = combinedBooks.slice((page - 1) * limit, page * limit);
    const totalCombined = combinedBooks.length;

    res.json({ 
      books: paginatedBooks, 
      page, 
      totalPages: Math.ceil(totalCombined / limit),
      totalBooks: totalCombined
    });
  } catch (err) {
    console.error("Error in getAllBooks:", err);
    res.status(500).json({ message: "Server error fetching books" });
  }
};

export const getBookById = async (req, res) => {
  try {
    const bookId = req.params.id;
    if (!bookId) return res.status(400).json({ message: "Book ID is required" });

    // Try to find book in MongoDB first
    let book = await Book.findById(bookId);
    
    // If not found in MongoDB, check local JSON file
    if (!book) {
      try {
        const jsonPath = path.resolve(__dirname, '../book-data.json');
        const fileContent = fs.readFileSync(jsonPath, 'utf8');
        const match = fileContent.match(/const\s+realBooksData\s*=\s*(\[[\s\S]*\]);/);
        
        if (match && match[1]) {
          // eslint-disable-next-line no-eval
          const localBooks = eval(match[1]);
          book = localBooks.find(b => b._id === bookId);
        }
      } catch (fileErr) {
        console.error("Error reading local book data:", fileErr);
      }
    }
    
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
