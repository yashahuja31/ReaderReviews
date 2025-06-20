import express from 'express';
import { getAllBooks, getBookById, addBook } from '../controllers/bookController.js';
import protect from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/adminMiddleware.js';

const router = express.Router();


router.get('/', getAllBooks); // becomes /api/books and is public
router.get('/:id', getBookById); // becomes /api/books/:id and is publci
router.post('/', protect, isAdmin, addBook); // becomes /api/books (POST) but is private
 
export default router;
