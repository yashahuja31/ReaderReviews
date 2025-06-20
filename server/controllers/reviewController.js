import Review from '../models/review.js';
import Book from '../models/book.js';

export const getReviewsByBook = async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId })
      .populate('user', 'name');
    res.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ message: "Error fetching reviews" });
  }
};

export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { bookId } = req.params;

    if (!rating) {
      return res.status(400).json({ message: "Rating is required" });
    }

    const existingReview = await Review.findOne({
      user: req.user._id,
      book: bookId
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You already reviewed this book' });
    }

    const review = new Review({
      user: req.user._id,
      book: bookId,
      rating,
      comment
    });

    await review.save();

    // Recalculate average rating
    const reviews = await Review.find({ book: bookId });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    await Book.findByIdAndUpdate(bookId, { averageRating: avgRating });

    res.status(201).json({ message: 'Review added' });
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).json({ message: "Error adding review" });
  }
};
