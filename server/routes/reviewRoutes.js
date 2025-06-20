import express from 'express';
import { getReviewsByBook, addReview } from '../controllers/reviewController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:bookId', getReviewsByBook); // to get a review (GET command)

router.post('/:bookId', protect, addReview); // to add a review (POST command)

router.post('/:bookId/review', protect, addReview);

router.post('/:bookId/review', protect , async (req, res) => {
  const { comment } = req.body;
  const book = await Book.findById(req.params.bookId);
  if (!book) return res.status(404).json({ message: 'Book not found' });

  const review = {
    user: req.user._id,
    comment,
    bookTitle: book.title,
  };

  // Save review in user
  req.user.reviews.push(review);
  await req.user.save();

  res.status(201).json({ message: 'Review added' });
});

export default router;
