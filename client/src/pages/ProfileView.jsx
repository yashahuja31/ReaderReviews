import { useEffect, useState } from 'react';
import { getUserProfile } from '../services/userService';
import { useAuth } from '../contexts/authContext';
import './ProfilePage.css'; // Reusing the same CSS

const ProfileView = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !user.token) {
        setError('You need to be logged in to view this profile.');
        return;
      }

      try {
        const data = await getUserProfile(user.token);
        setProfile(data);
        setError('');
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        const errorMessage = err.response?.data?.message || 'Error fetching profile data.';
        setError(errorMessage);
        setProfile(null);
      }
    };

    fetchProfile();
  }, [user]);

  if (error) {
    return <div className="profile-page"><p className="error-message">{error}</p></div>;
  }

  if (!profile) {
    return <div className="profile-page"><p>Loading profile...</p></div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-left">
          <h2>{profile.name}'s Profile</h2>
          <p>Email: {profile.email}</p>
          <p>{profile.isAdmin ? 'Admin User' : 'Regular User'}</p>
        </div>
      </div>

      {/* Books Read Section */}
      <div className="horizontal-section">
        <h3>Books Read</h3>
        <div className="scroll-container">
          {profile.booksRead && profile.booksRead.length > 0 ? (
            profile.booksRead.map((book) => (
              <div key={book._id} className="scroll-item">
                <p>{book.title}</p>
              </div>
            ))
          ) : (
            <p>No books read yet.</p>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="horizontal-section">
        <h3>Reviews</h3>
        <div className="scroll-container">
          {profile.reviews && profile.reviews.length > 0 ? (
            profile.reviews.map((review, index) => (
              <div key={index} className="scroll-item">
                <p><strong>{review.bookTitle}</strong></p>
                <p>Rating: {review.rating}/5</p>
                <p>{review.comment}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;