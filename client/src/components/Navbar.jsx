import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <nav className="floating-navbar">
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/books" className="nav-link">Book List</Link>
        {user && (
          <>
            <Link to="/profilepage" className="nav-link">Your Reviews</Link>
            <Link to="/readlist" className="nav-link">Read List</Link>
          </>
        )}
      </div>
      {user ? (
        <div className="profile-section" ref={dropdownRef}>
          <div 
            className="profile-badge" 
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          {showDropdown && (
            <div className="profile-dropdown">
              <Link to="/profilepage" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                Your Profile
              </Link>
              <Link to="/profile-view" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                View Profile (3rd Person)
              </Link>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="auth-links">
          <Link to="/login" className="nav-link login-link">Login</Link>
          <Link to="/register" className="nav-link register-link">Register</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;