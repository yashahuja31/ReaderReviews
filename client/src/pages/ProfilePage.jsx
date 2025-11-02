import { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile } from '../services/userService';
import LogoutButton from '../components/LogoutButton';
import { useAuth } from '../contexts/authContext';
import { deleteReview } from '../services/reviewService';
import { Link } from 'react-router-dom';
import { Star, Edit2, Trash2, BookOpen, Clock, Award, User, Settings, ChevronRight, BookMarked } from 'lucide-react';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, login } = useAuth(); 
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(''); 
  const [showChangeUsername, setShowChangeUsername] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const fetchProfile = async () => {
    console.log("ProfilePage: useEffect initiated.");
    console.log("Current user object from useAuth:", user);

    if (!user || !user.token) {
      console.log("ProfilePage: User or user token is missing. Aborting fetchProfile.");
      setError('You need to be logged in to view your profile.');
      return;
    }

    try {
      console.log("ProfilePage: Attempting to fetch profile with token:", user.token);
      const data = await getUserProfile(user.token);
      console.log("ProfilePage: Profile data fetched successfully:", data);
      setProfile(data);
      setError('');
    } catch (err) {
      console.error('ProfilePage: Failed to fetch profile:', err);
      const errorMessage = err.response?.data?.message || 'Error fetching profile data.';
      setError(errorMessage);
      setProfile(null);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleUsernameUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!newUsername.trim()) {
      setError('Username cannot be empty.');
      return;
    }
    if (newUsername === profile.name) {
      setMessage('New username is the same as current username.');
      setNewUsername('');
      setShowChangeUsername(false);
      return;
    }

    try {
      console.log("ProfilePage: Attempting to update username to:", newUsername);
      const updatedUserData = await updateUserProfile({ name: newUsername }, user.token);
      console.log("ProfilePage: Username updated successfully:", updatedUserData);
      setProfile(updatedUserData); 
      login({ ...user, name: updatedUserData.name });
      setMessage('Username updated successfully!');
      setNewUsername('');
      setShowChangeUsername(false);
    } catch (err) {
      console.error('ProfilePage: Failed to update username:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update username.';
      setError(errorMessage);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!newPassword.trim()) {
      setError('Password cannot be empty.');
      return;
    }

    try {
      console.log("ProfilePage: Attempting to update password.");
      await updateUserProfile({ password: newPassword }, user.token);
      console.log("ProfilePage: Password updated successfully.");
      setMessage('Password updated successfully!');
      setNewPassword('');
      setShowChangePassword(false);
    } catch (err) {
      console.error('ProfilePage: Failed to update password:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update password.';
      setError(errorMessage);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }
    try {
      await deleteReview(reviewId, user.token);
      setMessage("Review deleted successfully!");
      fetchProfile(); // Re-fetch profile to update the review list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete review.");
    }
  };

  if (error) {
    return (
      <div className="profile-page">
        <p className="error-message">{error}</p>
        <div className="logout-section">
          <LogoutButton />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <p>Loading profile...</p>
        <div className="logout-section">
          <LogoutButton />
        </div>
      </div>
    );
  }

  return (
    <div className="imdb-profile-container">
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
      
      {!profile ? (
        <div className="loading-spinner">Loading profile data...</div>
      ) : (
        <>
          {/* Profile Header Banner */}
          <div className="profile-banner">
            <div className="profile-avatar">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <h1>{profile.name}</h1>
              <p className="profile-email">{profile.email}</p>
              <div className="profile-badge">
                {profile.isAdmin ? 'Admin' : 'Member'}
              </div>
            </div>
          </div>
          
          {/* Profile Stats */}
          <div className="profile-stats">
            <div className="stat-item">
              <div className="stat-value">{profile.reviews ? profile.reviews.length : 0}</div>
              <div className="stat-label">Reviews</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{profile.booksRead ? profile.booksRead.length : 0}</div>
              <div className="stat-label">Read</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">0</div>
              <div className="stat-label">Want to Read</div>
            </div>
          </div>
          
          {/* Profile Actions */}
          <div className="profile-actions">
            <button 
              className="profile-action-btn"
              onClick={() => { 
                setShowChangeUsername(!showChangeUsername); 
                setShowChangePassword(false); 
                setMessage(''); 
                setError(''); 
              }}
            >
              <Edit2 size={18} /> Edit Username
            </button>
            <button 
              className="profile-action-btn"
              onClick={() => { 
                setShowChangePassword(!showChangePassword); 
                setShowChangeUsername(false); 
                setMessage(''); 
                setError(''); 
              }}
            >
              <Settings size={18} /> Change Password
            </button>
            <LogoutButton className="profile-action-btn logout-btn" />
          </div>
          
          {/* Username Update Form */}
          {showChangeUsername && (
            <div className="modal-overlay">
              <div className="modal-content">
                <form onSubmit={handleUsernameUpdate} className="update-form">
                  <h3>Update Username</h3>
                  <div className="form-group">
                    <label htmlFor="newUsername">New Username:</label>
                    <input
                      type="text"
                      id="newUsername"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="submit-button">Update</button>
                    <button 
                      type="button" 
                      className="cancel-button"
                      onClick={() => {
                        setShowChangeUsername(false);
                        setNewUsername('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {/* Password Update Form */}
          {showChangePassword && (
            <div className="modal-overlay">
              <div className="modal-content">
                <form onSubmit={handlePasswordUpdate} className="update-form">
                  <h3>Update Password</h3>
                  <div className="form-group">
                    <label htmlFor="newPassword">New Password:</label>
                    <input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="submit-button">Update</button>
                    <button 
                      type="button" 
                      className="cancel-button"
                      onClick={() => {
                        setShowChangePassword(false);
                        setNewPassword('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {/* Content Sections */}
          <div className="profile-content">
            {/* Reviews Section */}
            <section className="profile-section">
              <div className="section-header">
                <h2><Star className="section-icon" /> Your Reviews</h2>
              </div>
              
              {profile.reviews && profile.reviews.length > 0 ? (
                <div className="reviews-grid">
                  {profile.reviews.map((review) => (
                    <div key={review._id} className="review-card">
                      <div className="review-book-info">
                        <Link to={`/books/${review.book}`}>
                          <h3 className="book-title">{review.bookTitle}</h3>
                        </Link>
                        <div className="review-rating">
                          <Star size={16} className="star-icon" />
                          <span>{review.rating}/5</span>
                        </div>
                      </div>
                      <p className="review-content">{review.comment}</p>
                      <button 
                        className="delete-review-btn"
                        onClick={() => handleDeleteReview(review._id)}
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <BookOpen size={48} />
                  <p>You haven't written any reviews yet.</p>
                  <Link to="/books" className="action-link">Browse Books to Review</Link>
                </div>
              )}
            </section>
            
            {/* Reading List Section */}
            <section className="profile-section">
              <div className="section-header">
                <h2><BookOpen className="section-icon" /> Your Reading List</h2>
              </div>
              
              {profile.booksRead && profile.booksRead.length > 0 ? (
                <div className="books-grid">
                  {profile.booksRead.map((book) => (
                    <div key={book._id} className="book-card">
                      <Link to={`/books/${book._id}`}>
                        <h3 className="book-title">{book.title}</h3>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <BookOpen size={48} />
                  <p>Your reading list is empty.</p>
                  <Link to="/books" className="action-link">Find Books to Read</Link>
                </div>
              )}
            </section>
            
            {/* Admin Section */}
            {profile.isAdmin && (
              <section className="profile-section admin-section">
                <div className="section-header">
                  <h2><Award className="section-icon" /> Admin Controls</h2>
                </div>
                
                <div className="admin-controls">
                  <Link to="/addbook" className="admin-action-btn">
                    <BookOpen size={18} /> Add New Book
                  </Link>
                  <Link to="/admin/users" className="admin-action-btn">
                    <User size={18} /> Manage Users
                  </Link>
                </div>
                
                {profile.allBooks && profile.allBooks.length > 0 && (
                  <div className="admin-books-list">
                    <h3>All Books ({profile.allBooks.length})</h3>
                    <div className="admin-books-grid">
                      {profile.allBooks.map((book) => (
                        <div key={book._id} className="admin-book-item">
                          <span>{book.title}</span>
                          <div className="admin-book-actions">
                            <Link to={`/books/edit/${book._id}`} className="edit-btn">
                              <Edit2 size={16} />
                            </Link>
                            <button className="delete-btn">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
