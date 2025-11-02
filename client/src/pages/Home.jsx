import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import LogoutButton from "../components/LogoutButton";
import { useAuth } from "../contexts/authContext";
import './Home.css';
import { BookOpen, User, PlusCircle, LogIn, UserPlus, TrendingUp, Star, Award, ThumbsUp, Clock, Heart, BookmarkIcon, Coffee, BookmarkPlus, Bookmark, Search } from "lucide-react";
import BookRecommendation from "../components/BookRecommendation";
import axios from "axios";

const Home = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [topRatedBooks, setTopRatedBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [mostReadBooks, setMostReadBooks] = useState([]);
  const [classicBooks, setClassicBooks] = useState([]);
  const [featuredBook, setFeaturedBook] = useState(null);
  
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        // Use hardcoded sample data for now to ensure display works
        const books = [
          { _id: "688cbbdf1304b495ca85c50a", title: "Pride and Prejudice", author: "Jane Austen", genre: "Classic", description: "A romantic novel of manners set in Georgian England.", coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600", averageRating: 4.7, readCount: 19870, popularity: 9.6, isClassic: true },
          { _id: "688cbbdf1304b495ca85c50b", title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Classic", description: "A novel of warmth and humor despite dealing with serious issues of rape and racial inequality.", coverImage: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600", averageRating: 4.8, readCount: 24680, popularity: 9.9, isClassic: true },
          { _id: "688cbbdf1304b495ca85c50c", title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Classic", description: "A critique of the American Dream set in the Jazz Age.", coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600", averageRating: 4.5, readCount: 18750, popularity: 9.7, isClassic: true },
          { _id: "688cbbdf1304b495ca85c50d", title: "1984", author: "George Orwell", genre: "Dystopian", description: "A dystopian social science fiction novel and cautionary tale.", coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600", averageRating: 4.7, readCount: 22560, popularity: 9.8, isClassic: true },
          { _id: "688cbbdf1304b495ca85c50e", title: "Moby-Dick", author: "Herman Melville", genre: "Classic", description: "The narrative of Captain Ahab's obsessive quest for the white whale.", coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600", averageRating: 4.2, readCount: 8340, popularity: 8.9, isClassic: true },
          { _id: "688cbbdf1304b495ca85c50f", title: "Jane Eyre", author: "Charlotte Brontë", genre: "Classic", description: "A bildungsroman following the experiences of its eponymous heroine.", coverImage: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600", averageRating: 4.6, readCount: 15670, popularity: 9.4, isClassic: true },
          { _id: "688cbbdf1304b495ca85c510", title: "Wuthering Heights", author: "Emily Brontë", genre: "Classic", description: "A tale of passion and revenge on the Yorkshire moors.", coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600", averageRating: 4.3, readCount: 12450, popularity: 9.1, isClassic: true },
          { _id: "688cbbdf1304b495ca85c511", title: "Crime and Punishment", author: "Fyodor Dostoevsky", genre: "Classic", description: "A psychological exploration of guilt and redemption.", coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600", averageRating: 4.7, readCount: 13890, popularity: 9.3, isClassic: true },
          { _id: "688cbbdf1304b495ca85c512", title: "War and Peace", author: "Leo Tolstoy", genre: "Classic", description: "An epic tale of Russian society during the Napoleonic Era.", coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600", averageRating: 4.6, readCount: 9870, popularity: 9.5, isClassic: true },
          { _id: "688cbbdf1304b495ca85c513", title: "Anna Karenina", author: "Leo Tolstoy", genre: "Classic", description: "A tragic story of love and society in Imperial Russia.", coverImage: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600", averageRating: 4.5, readCount: 11230, popularity: 9.2, isClassic: true }
        ];
        
        if (books.length > 0) {
          // Set featured book (random from top rated)
          const topBooks = [...books].sort((a, b) => b.averageRating - a.averageRating).slice(0, 10);
          const randomIndex = Math.floor(Math.random() * topBooks.length);
          setFeaturedBook(topBooks[randomIndex]);
          
          // Sort books by rating for top rated
          setTopRatedBooks([...books].sort((a, b) => b.averageRating - a.averageRating).slice(0, 8));
          
          // Sort books by read count for most read
          setMostReadBooks([...books].sort((a, b) => b.readCount - a.readCount).slice(0, 8));
          
          // Set popular books based on popularity field
          setPopularBooks([...books].sort((a, b) => b.popularity - a.popularity).slice(0, 8));
          
          // Set classic books
          setClassicBooks([...books].filter(book => book.isClassic).slice(0, 8));
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, []);

  return (
    <div className="homi">
      <h1 className="home-title">📚 ReaderReviews Hub</h1>
      <p className="home-description">
        Discover, review, and share your thoughts on your favorite books with a vibrant community of readers.
      </p>

      {/* Featured Book Section */}
      {featuredBook && (
        <div className="featured-book-section">
          <h2 className="section-title">Featured Book of the Day</h2>
          <div className="featured-book-container">
            <div className="featured-book-image">
              <img src={featuredBook.coverImage} alt={featuredBook.title} />
            </div>
            <div className="featured-book-details">
              <h3>{featuredBook.title}</h3>
              <p className="featured-book-author">by {featuredBook.author}</p>
              <div className="featured-book-rating">
                <Star className="star-icon" />
                <span>{featuredBook.averageRating?.toFixed(1) || "N/A"}</span>
              </div>
              <p className="featured-book-description">
                {featuredBook.description?.substring(0, 200)}
                {featuredBook.description?.length > 200 ? "..." : ""}
              </p>
              <Link to={`/book/${featuredBook._id}`} className="featured-book-link">
                View Details
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="home-section">
        <h3>Explore the World of Books</h3>
        <ul className="home-list">
          <li>
            <Link to="/books">
              <BookOpen /> <span>Browse All Books</span>
            </Link>
          </li>
          <li>
            <Link to="/books?sort=popular">
              <TrendingUp /> <span>Popular Books</span>
            </Link>
          </li>
          <li>
            <Link to="/books?filter=classics">
              <Award /> <span>Classic Literature</span>
            </Link>
          </li>
          <li>
            <Link to="/search">
              <Search /> <span>Advanced Search</span>
            </Link>
          </li>
          {user && (
            <>
              <li>
                <Link to="/profilepage">
                  <User /> <span>Your Profile</span>
                </Link>
              </li>
              <li>
                <Link to="/bookmarks">
                  <Bookmark /> <span>Your Reading List</span>
                </Link>
              </li>
              {user.isAdmin && (
                <li>
                  <Link to="/addbook">
                    <PlusCircle /> <span>Add a New Book</span>
                  </Link>
                </li>
              )}
            </>
          )}
          {!user && (
            <>
              <li>
                <Link to="/login">
                  <LogIn /> <span>Login</span>
                </Link>
              </li>
              <li>
                <Link to="/register">
                  <UserPlus /> <span>Register</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {user && (
        <p className="welcome-message">
          Welcome back, <strong>{user.name}</strong>! You are logged in as {user.isAdmin ? "an Admin" : "a User"}.
        </p>
      )}

      {/* Book Sections */}
      <div className="book-sections-container">
        {/* Top Rated Books Section */}
        <div className="book-section">
          <h2><Star /> Top Rated Books</h2>
          <div className="book-grid">
            {loading ? (
              <p>Loading top rated books...</p>
            ) : (
              topRatedBooks.map(book => (
                <Link to={`/book/${book._id}`} className="book-card" key={book._id || book.id}>
                  <div className="book-cover">
                    <img src={book.coverImage} alt={book.title} />
                  </div>
                  <div className="book-info">
                    <h4>{book.title}</h4>
                    <p className="book-author">{book.author}</p>
                    <div className="book-rating">
                      <Star size={14} className="star-icon" />
                      <span>{book.averageRating?.toFixed(1) || "N/A"}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Popular Books Section */}
        <div className="book-section">
          <h2><TrendingUp /> Popular Books</h2>
          <div className="book-grid">
            {loading ? (
              <p>Loading popular books...</p>
            ) : (
              popularBooks.map(book => (
                <Link to={`/book/${book._id}`} className="book-card" key={book._id || book.id}>
                  <div className="book-cover">
                    <img src={book.coverImage} alt={book.title} />
                  </div>
                  <div className="book-info">
                    <h4>{book.title}</h4>
                    <p className="book-author">{book.author}</p>
                    <div className="book-rating">
                      <Star size={14} className="star-icon" />
                      <span>{book.averageRating?.toFixed(1) || "N/A"}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Most Read Books Section */}
        <div className="book-section">
          <h2><BookOpen /> Most Read Books</h2>
          <div className="book-grid">
            {loading ? (
              <p>Loading most read books...</p>
            ) : (
              mostReadBooks.map(book => (
                <Link to={`/book/${book._id}`} className="book-card" key={book._id || book.id}>
                  <div className="book-cover">
                    <img src={book.coverImage} alt={book.title} />
                  </div>
                  <div className="book-info">
                    <h4>{book.title}</h4>
                    <p className="book-author">{book.author}</p>
                    <div className="book-rating">
                      <Star size={14} className="star-icon" />
                      <span>{book.averageRating?.toFixed(1) || "N/A"}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Classic Books Section */}
        <div className="book-section">
          <h2><Award /> Classic Literature</h2>
          <div className="book-grid">
            {loading ? (
              <p>Loading classic books...</p>
            ) : (
              classicBooks.map(book => (
                <Link to={`/book/${book._id}`} className="book-card" key={book._id || book.id}>
                  <div className="book-cover">
                    <img src={book.coverImage} alt={book.title} />
                  </div>
                  <div className="book-info">
                    <h4>{book.title}</h4>
                    <p className="book-author">{book.author}</p>
                    <div className="book-rating">
                      <Star size={14} className="star-icon" />
                      <span>{book.averageRating?.toFixed(1) || "N/A"}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
