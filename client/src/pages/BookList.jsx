import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./BookList.css";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/books?page=${page}`);
        setBooks(res.data.books);
        setTotalPages(res.data.totalPages);
        setTotalBooks(res.data.totalBooks || 0);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching books:", err);
        setLoading(false);
      }
    };

    fetchBooks();
  }, [page]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>All Books 📚</h2>
      <p>Showing books from both our database and local collection ({totalBooks} total books)</p>
      
      {loading ? (
        <p>Loading books...</p>
      ) : books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <ul className="book-list">
          {books.map((book) => (
            <li key={book._id} className="book-item">
              {book.coverImage && (
                <div className="book-cover">
                  <img src={book.coverImage} alt={`Cover of ${book.title}`} />
                </div>
              )}
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                <p className="book-genre">{book.genre}</p>
                <p className="book-description">{book.description?.substring(0, 100)}...</p>
                <Link to={`/books/${book._id}`} className="view-details">View Details</Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: "1rem" }}>
        <button onClick={handlePrev} disabled={page === 1}>
          ◀ Prev
        </button>
        <span style={{ margin: "0 1rem" }}>
          Page {page} of {totalPages}
        </span>
        <button onClick={handleNext} disabled={page === totalPages}>
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default BookList;
