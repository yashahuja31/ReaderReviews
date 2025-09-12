import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserProfile } from '../services/userService';
import { useAuth } from '../contexts/authContext';
import './BookList.css'; // Reusing similar styling

const ReadList = () => {
  const { user } = useAuth();
  const [booksRead, setBooksRead] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReadList = async () => {
      if (!user || !user.token) {
        setError('You need to be logged in to view your read list.');
        setLoading(false);
        return;
      }

      try {
        const data = await getUserProfile(user.token);
        setBooksRead(data.booksRead || []);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch read list:', err);
        setError('Error loading your read list. Please try again later.');
        setLoading(false);
      }
    };

    fetchReadList();
  }, [user]);

  if (loading) {
    return <div className="book-list-container"><p>Loading your read list...</p></div>;
  }

  if (error) {
    return <div className="book-list-container"><p className="error-message">{error}</p></div>;
  }

  return (
    <div className="book-list-container">
      <h1>Your Read List</h1>
      
      {booksRead.length === 0 ? (
        <div className="no-books-message">
          <p>You haven't marked any books as read yet.</p>
          <Link to="/books" className="browse-books-link">Browse Books</Link>
        </div>
      ) : (
        <div className="book-grid">
          {booksRead.map((book) => (
            <Link to={`/books/${book._id}`} key={book._id} className="book-card">
              <div className="book-card-content">
                <h3>{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                {book.coverImage && (
                  <img 
                    src={book.coverImage} 
                    alt={`Cover of ${book.title}`} 
                    className="book-cover"
                  />
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReadList;