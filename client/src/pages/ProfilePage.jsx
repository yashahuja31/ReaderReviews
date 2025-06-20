import { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile } from '../services/userService';
import LogoutButton from '../components/LogoutButton';
import { useAuth } from '../contexts/authContext';
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

  useEffect(() => {
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
        const data = await getUserProfile(user.token); // getUserProfile already returns { data }
        console.log("ProfilePage: Profile data fetched successfully:", data);
        setProfile(data);
        setError(''); // Clear any previous errors
      } catch (err) {
        console.error('ProfilePage: Failed to fetch profile:', err);
        const errorMessage = err.response?.data?.message || 'Error fetching profile data.';
        setError(errorMessage); // Set specific error message
        setProfile(null); // Ensure profile is null on error
      }
    };
    fetchProfile();
  }, [user]); // Dependency array: re-run when the 'user' object changes

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

  // Render logic based on states
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

  // Once profile is loaded, render the content
  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-left">
          <h1>{profile.name}'s Profile</h1>
          <p>Email: {profile.email}</p>
          <p>Role: {profile.isAdmin ? 'Admin' : 'User'}</p>
        </div>
        <div className="profile-right">
          <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAqgMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABgcDBAUBAv/EADgQAAIBAwEFAwkGBwAAAAAAAAABAgMEBREGITFBUWGBkRITIiMyQqGx0RRSU3FywRUkMzRzsvD/xAAWAQEBAQAAAAAAAAAAAAAAAAAAAQL/xAAWEQEBAQAAAAAAAAAAAAAAAAAAARH/2gAMAwEAAhEDEQA/ALSABpkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB3mjlspbYuh5yu25P2Ka9qf/AHUhWR2jyF7JqNXzFLlCk9PF8WDVharhqe95UzqVJPWVSo31cmbtlmchZSToXM9F7s35SfcwaswHEwe0VDJtUasVSutPZT3T/S/2O34gAAAAAAAAAAAAAAAAAAAMF7dU7K0q3NZ+hTWr7eiM5E9urzSFvZxb0l6ya+CAjORva2Qu53Nw/SlwjyiuiNYA0gAAPqEpQnGUG1KL1i1xTLD2cyn8Usdamn2iloqi69Jd5XR2NlLv7LmKUdWoVvVy059PiZVYYHMAAAAAAAAAAAAAAAAACBbaScs1o+VKOnxJ6Qbbem45WnPlOktO5sCOgA0gAABnsZON9byXFVY/NGA28TTdXJ2lNc6sfmZVaAAAAAAAAAAAAAAAAAAAEb23s5VrCndRWsqD9PT7r5+JJD4q04Vac6dSKlCacZJ8GmBU4OtncJVxdZyjFztJP0Ki93sfb8zklAADTAkOxdm6+Slctert48esnwXzORj7C4yNwqNtTcpe9L3YLq2WLisfSxllG3o79H5U5c5S5sg3Hx7wAAAAAAAAAAAAAAAAAAAAHkkpRcZKMotaNSW5nGu9l8ZcPWNOVGT50paLwe437zJ2Vj/dXNOD+7rq/BHHr7X2EH6qlXq9yiviBiexlrruu6yX6YmxbbI46lJSqyrVuyUtF8DUe2tPXdY1NP8AKvoZqW2VnJpVbavT7U1ICQW1vRtaSpW9KFOC5QWhlObZ53G3jUaV1GMn7tT0WdIAAAAAAAAAAAAAAAAAAc7N5alirXzk9J1p7qVPX2n9AM2RyNtjqPnbqoop+zFb5SfYiF5Taa9vHKFBu2odIv0n+bOVe3le+uJV7mbnN+CXRdhgAPe9d+r4vXeACoAAoadTo43NX2N0VCq5Utd9Ko9Yv6HOBBYuFztrlEoL1VxzpTfH8up1ipYSlCSlCTjKL1UluaZONmdoPt+lpeNK5S9CXDzi+pFSIAAAAAAAAAAAABhurila29SvXl5NOEXJsrTKX9bJXdS5uN2u6MeUVyRItt79uVLHwlu3VKunXkv37yJoAACxKAAoAAAAAB9U5zpzU6cnGcWpJriu0+QRYsjZ/KLKWCqTeleD8mrHt5PvOmVzszf/AMPylNylpSq+rnrwWr3PuLGIAAAAAAAAB5u58D01cnVdDHXVVcY0ZNeAFcZS5d5kbm5b/qVG12LgvgkaoQLEoACgAAAAAAAAAAQa1WhZ2GuneYy2ryes5QSl+a3MrEnWxNVzxEofh1Wl3rUipCACAAAAAAHO2hemDvNPwpAAVqACxAAFAAAAAAAAAAACZ7Bv+SuVy86v9T0Eok4AI0AAI//Z" alt="Profile" className="profile-pic" />
        </div>
      </div>

      <hr style={{ margin: "2rem 0" }} />

      <div className="horizontal-section">
        <h3>Books Read ({profile.booksRead ? profile.booksRead.length : 0})</h3>
        <div className="scroll-container">
          {profile.booksRead && profile.booksRead.length > 0 ? (
            profile.booksRead.map((book) => (
              <div key={book._id} className="scroll-item">
                <p>{book.title}</p>
              </div>
            ))
          ) : (
            <p>No books marked as read yet.</p>
          )}
        </div>
      </div>

      <div className="horizontal-section">
        <h3>Your Reviews ({profile.reviews ? profile.reviews.length : 0})</h3>
        <div className="scroll-container">
          {profile.reviews && profile.reviews.length > 0 ? (
            profile.reviews.map((review, index) => (
              <div key={index} className="scroll-item">
                <p><strong>Book:</strong> {review.bookTitle}</p>
                <p><strong>Rating:</strong> {review.rating} / 5</p>
                <p><strong>Comment:</strong> {review.comment}</p>
              </div>
            ))
          ) : (
            <p>No reviews submitted yet.</p>
          )}
        </div>
      </div>

      {profile.isAdmin && (
        <div className="horizontal-section">
          <h3>All Books (Admin View) ({profile.allBooks ? profile.allBooks.length : 0})</h3>
          <div className="scroll-container">
            {profile.allBooks && profile.allBooks.length > 0 ? (
              profile.allBooks.map((book) => (
                <div key={book._id} className="scroll-item admin-book">
                  <p>{book.title}</p>
                  <button>Edit</button>
                  <button>Delete</button>
                </div>
              ))
            ) : (
              <p>No books in the database.</p>
            )}
            <button className="add-book-button">
              <a href="/addbook" style={{ textDecoration: 'none', color: 'inherit' }}>+ Add Book</a>
            </button>
          </div>
        </div>
      )}

      <div className="profile-actions">
        <button onClick={() => { setShowChangeUsername(!showChangeUsername); setShowChangePassword(false); setMessage(''); setError(''); }}>Change Username</button>
        <button onClick={() => { setShowChangePassword(!showChangePassword); setShowChangeUsername(false); setMessage(''); setError(''); }}>Change Password</button>
      </div>

      {showChangeUsername && (
        <form onSubmit={handleUsernameUpdate} className="inline-form">
          <input
            type="text"
            placeholder="Enter new username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            required
          />
          <button type="submit">Update Username</button>
        </form>
      )}

      {showChangePassword && (
        <form onSubmit={handlePasswordUpdate} className="inline-form">
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit">Update Password</button>
        </form>
      )}

      {message && <p className="message">{message}</p>}
    

      <div className="logout-section">
        <LogoutButton />
      </div>
    </div>
  );
};

export default ProfilePage;