import { Link } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import { useAuth } from "../contexts/authContext";
import './Home.css';

import { BookOpen, User, PlusCircle, LogIn, UserPlus } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <h1 className="home-title">📚 ReaderReviews Hub</h1>
      <p className="home-description">
        Discover, review, and share your thoughts on your favorite books with a vibrant community of readers.
      </p>

      <div className="home-section">
        <h3>Explore the World of Books</h3>
        <ul className="home-list">
          <li>
            <Link to="/books">
              <BookOpen /> <span>Browse All Books</span>
            </Link>
          </li>
          {user && (
            <>
              <li>
                <Link to="/profilepage">
                  <User /> <span>Your Profile</span>
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

      <div className="logout-container">
        <LogoutButton />
      </div>
    </div>
  );
};

export default Home;
