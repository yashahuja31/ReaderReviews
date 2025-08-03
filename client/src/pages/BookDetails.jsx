import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/authContext";
import "./BookDetails.css";
import { Star } from 'lucide-react';
import { markBookAsRead } from "../services/userService";
import { getReviews, submitReview, deleteReview } from "../services/reviewService"; 

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [readMessage, setReadMessage] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    try {
      const data = await getReviews(id);
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews", err);
    }
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`https://readerreviews.onrender.com/api/books/${id}`);
        setBook(res.data);
      } catch (err) {
        setError("Book not found or an error occurred.");
        console.error(err);
      }
    };

    if (id) {
      fetchBook();
      fetchReviews();
    }
  }, [id]);

  const handleMarkAsRead = async () => {
    if (!user) {
      setReadMessage("Please log in to mark as read.");
      return;
    }
    try {
      await markBookAsRead(id, user.token);
      setReadMessage("✅ Book marked as read!");
    } catch (err) {
      console.error("Mark as read failed", err);
      setReadMessage("❌ Failed to mark as read.");
    }
  };

  const handleReviewSubmit = async (e) => { // Renamed local function
    e.preventDefault();
    if (!user) {
      setReviewMessage("Please log in to submit a review.");
      return;
    }
    if (rating === 0) {
      setReviewMessage("Please select a rating.");
      return;
    }

    try {
      await submitReview(id, { rating, comment }, user.token);
      setReviewMessage("✅ Review submitted successfully!");
      setRating(0);
      setComment("");
      
      const updatedReviews = await getReviews(id);
      setReviews(updatedReviews);
      const bookRes = await axios.get(`https://readerreviews.onrender.com/api/books/${id}`);
      setBook(bookRes.data);
    } catch (err) {
      setReviewMessage(err.response?.data?.message || "Error submitting review.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }
    try {
      await deleteReview(reviewId, user.token);
      setReviewMessage("Review deleted successfully!");
      fetchReviews(); // Re-fetch reviews to update the list
    } catch (err) {
      setReviewMessage(err.response?.data?.message || "Failed to delete review.");
    }
  };

  if (error) return <p className="error-message">{error}</p>;
  if (!book) return <p>Loading book details...</p>;

  const hasUserReview = reviews.some(r => r.user?._id === user?._id);

  return (
    <div className="book-details-container">
      <Link to="/books" className="back-link">← Back to Book List</Link>

      <div className="book-details-content">
        {book.coverImage && (
          <div className="book-cover-wrapper">
            <img
              src={book.coverImage}
              alt={book.title}
              className="book-details-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/250x350/E0E0E0/7F8C8D?text=No+Cover"; }}
            />
          </div>
        )}
        <div className="book-details-info">
          <h2>{book.title}</h2>
          <p><strong>Author:</strong> {book.author}</p>
          {book.genre && <p><strong>Genre:</strong> {book.genre}</p>}
          {book.description && <p><strong>Description:</strong> {book.description}</p>}
          <div className="book-details-rating">
            <strong>Average Rating:</strong>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={20}
                className={star <= Math.round(book.averageRating) ? "filled-star" : ""}
              />
            ))}
            ({book.averageRating ? book.averageRating.toFixed(1) : 'N/A'})
          </div>

          {user && (
            <div className="book-actions">
              <button onClick={handleMarkAsRead} className="read-button">📚 Mark as Read</button>
              {readMessage && <p className="feedback-message">{readMessage}</p>}
            </div>
          )}
        </div>
      </div>

      <hr />

      <div className="submit-review-section">
        <h3>Submit a Review</h3>
        {reviewMessage && (
          <p className={reviewMessage.startsWith("✅") ? "feedback-message" : "error-message"}>
            {reviewMessage}
          </p>
        )}
        {user ? (
          hasUserReview ? (
            <p>You have already reviewed this book. Go to your profile to edit or delete your review.</p>
          ) : (
            <form onSubmit={handleReviewSubmit} className="review-form">
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={32}
                    className={`star ${star <= rating ? "filled" : ""}`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
              <textarea
                rows="3"
                placeholder="Write your review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
              <button type="submit">Submit Review</button>
            </form>
          )
        ) : (
          <p>Login to submit a review.</p>
        )}
      </div>

      <hr />

      <div className="reviews-section">
        <h3>Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review this book!</p>
        ) : (
          <ul className="review-list">
            {reviews.map((r) => (
              <li key={r._id} className="review-item">
                <strong>{r.user?.name || 'Anonymous'}</strong>
                <div className="review-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={star <= r.rating ? "filled-star" : ""}
                    />
                  ))}
                  ({r.rating} / 5)
                </div>
                <p>{r.comment}</p>
                {user?._id === r.user?._id && (
                  <button onClick={() => handleDeleteReview(r._id)}>Delete</button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
