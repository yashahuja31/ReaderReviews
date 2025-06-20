import User from '../models/user.js';
import Book from '../models/book.js';
import Review from '../models/review.js';
import bcrypt from 'bcryptjs';

// GET /api/users/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    const booksRead = await Book.find({ _id: { $in: user.booksRead } }, 'title');

    const userReviews = await Review.find({ user: user._id }).populate('book', 'title');
    const reviews = userReviews.map((review) => ({
      bookTitle: review.book?.title || 'Unknown Book',
      comment: review.comment || '',
      rating: review.rating || 0
    }));

    const allBooks = user.isAdmin ? await Book.find({}, 'title') : [];

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      booksRead,
      reviews,
      allBooks
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
};

// PUT /api/users/profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (req.body.name) user.name = req.body.name;
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Server error updating user profile' });
  }
};

// POST /api/users/read/:bookId
export const markBookAsRead = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const bookId = req.params.bookId;

    if (!user.booksRead.includes(bookId)) {
      user.booksRead.push(bookId);
      await user.save();
    }

    res.status(200).json({ message: 'Book marked as read' });
  } catch (err) {
    console.error('Error marking book as read:', err);
    res.status(500).json({ message: 'Error marking book as read' });
  }
};
