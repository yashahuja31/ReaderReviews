import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/authContext";
import "./BookDetails.css";

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
    if (!user) return alert("Please log in to mark as read");
    try {
      await axios.post(`/api/users/read/${id}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setReadMessage("✅ Book marked as read!");
    } catch (err) {
      console.error("Mark as read failed", err);
      setReadMessage("❌ Failed to mark as read");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in to review");
    if (rating === 0) return alert("Please select a rating");

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
      setReviewMessage("✅ Review submitted!");
      setRating(0);
      setComment("");

      const { data } = await axios.get(`/api/reviews/${id}`);
      setReviews(data);
    } catch (err) {
      setReviewMessage(err.response?.data?.message || "Error submitting review");
    }
  };

  if (error) return <p>{error}</p>;
  if (!book) return <p>Loading book details...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <Link to="/books">← Back to List</Link>
      <h2>{book.title}</h2>
      <p><strong>Author:</strong> {book.author}</p>
      {book.genre && <p><strong>Genre:</strong> {book.genre}</p>}
      {book.description && <p><strong>Description:</strong> {book.description}</p>}
      {book.coverImage && (
        <div>
          <img
            src={book.coverImage}
            alt={book.title}
            style={{ width: "200px", marginTop: "1rem" }}
          />
        </div>
      )}

      {user && (
        <div style={{ marginTop: "1rem" }}>
          <button onClick={handleMarkAsRead}>📚 Mark as Read</button>
          {readMessage && <p>{readMessage}</p>}
        </div>
      )}

      <hr style={{ margin: "2rem 0" }} />

      <h3>Submit a Review</h3>
      {reviewMessage && <p>{reviewMessage}</p>}
      {user ? (
        <form onSubmit={submitReview}>
          <div style={{ fontSize: "24px", marginBottom: "0.5rem" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                style={{
                  color: star <= rating ? "#ffc107" : "#ccc",
                  cursor: "pointer",
                }}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            rows="3"
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />
          <br />
          <button type="submit">Submit Review</button>
        </form>
      ) : (
        <p>Login to submit a review.</p>
      )}

      <hr style={{ margin: "2rem 0" }} />

      <h3>Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((r) => (
          <div key={r._id} style={{ marginBottom: "1rem" }}>
            <p>
              <strong>{r.user?.name}</strong> rated: {r.rating}★
            </p>
            <p>{r.comment}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default BookDetails;
