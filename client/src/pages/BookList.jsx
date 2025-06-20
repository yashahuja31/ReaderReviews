import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`/api/books?page=${page}`);
        setBooks(res.data.books);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Error fetching books:", err);
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
      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book._id}>
              <strong>{book.title}</strong> by {book.author} — {book.genre}
              <br />
              <Link to={`/books/${book._id}`}>View Details</Link>
              <hr />
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
