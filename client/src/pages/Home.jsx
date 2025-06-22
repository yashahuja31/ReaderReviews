import { Link } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import { useAuth } from "../contexts/authContext";
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>📚 BookReview Hub</h1>
      <p style={{ fontSize: "1.2rem", margin: "1rem 0" }}>
        Discover, review, and share your thoughts on your favorite books!
      </p>

      <div style={{ margin: "2rem 0" }}>
        <h3>Explore:</h3>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          <li><Link to="/books">📖 Browse All Books</Link></li>
          {user && (
            <>
              <li><Link to="/profilepage">👤 Your Profile</Link></li>
              {user.isAdmin && <li><Link to="/addbook">➕ Add a New Book</Link></li>}
            </>
          )}
          {!user && (
            <>
              <li><Link to="/login">🔐 Login</Link></li>
              <li><Link to="/register">📝 Register</Link></li>
            </>
          )}
        </ul>
      </div>

      {user && (
        <div style={{ marginTop: "2rem", fontStyle: "italic" }}>
          Logged in as <strong>{user.name}</strong> ({user.isAdmin ? "Admin" : "User"})
        </div>
      )}

      <LogoutButton />
    </div>
  );
};

export default Home;
