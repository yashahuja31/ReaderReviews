import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/authContext";
import "./BookDetails.css";
import { Star } from 'lucide-react'; // Import Star icon

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

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`/api/books/${id}`);
        setBook(res.data);
      } catch (err) {
        setError("Book not found or an error occurred.");
        console.error(err);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`/api/reviews/${id}`);
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews", err);
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
      await axios.post(`/api/users/read/${id}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setReadMessage("✅ Book marked as read!");
    } catch (err) {
      console.error("Mark as read failed", err);
      setReadMessage("❌ Failed to mark as read.");
    }
  };

  const submitReview = async (e) => {
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
      await axios.post(
        `/api/reviews/${id}`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setReviewMessage("✅ Review submitted successfully!");
      setRating(0);
      setComment("");

      // Re-fetch reviews to update the list and average rating
      const { data } = await axios.get(`/api/reviews/${id}`);
      setReviews(data);
      // Optionally re-fetch book to update average rating display
      const bookRes = await axios.get(`/api/books/${id}`);
      setBook(bookRes.data);

    } catch (err) {
      setReviewMessage(err.response?.data?.message || "Error submitting review.");
    }
  };

  if (error) return <p className="error-message">{error}</p>;
  if (!book) return <p>Loading book details...</p>;

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
          <form onSubmit={submitReview} className="review-form">
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
