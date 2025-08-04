import express from 'express';
import { getAllBooks, getBookById, addBook } from '../controllers/bookController.js';
import protect from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/adminMiddleware.js';

const router = express.Router();

// route to get all books
router.get('/', getAllBooks);

// route to get a book by its ID
router.get('/:id', getBookById);

// route to add a new book (protected for admins)
router.post('/', protect, isAdmin, addBook);

export default router;
