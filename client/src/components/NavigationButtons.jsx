// src/components/NavigationButtons.jsx
import { Link } from 'react-router-dom'; // Removed useNavigate
import { useAuth } from '../contexts/authContext';
import LogoutButton from './LogoutButton';
import React from 'react';

const NavigationButtons = () => {
  const { user } = useAuth();

  // Only render these buttons if a user is logged in
  if (!user) {
    return null;
  }

  // You can add some basic styling here or in a dedicated CSS file
  const navButtonStyle = {
    padding: '10px 15px',
    margin: '0 8px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    textDecoration: 'none', // For Link components
    display: 'inline-block', // For Link components
    textAlign: 'center',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
  };

  const navButtonHoverStyle = {
    backgroundColor: '#764ba2',
  };

  return (
    <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
      <Link
        to="/profilepage"
        style={navButtonStyle}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = navButtonHoverStyle.backgroundColor}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = navButtonStyle.backgroundColor}
      >
        Your Profile
      </Link>
      <Link
        to="/books"
        style={navButtonStyle}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = navButtonHoverStyle.backgroundColor}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = navButtonStyle.backgroundColor}
      >
        Book List
      </Link>
      {/* LogoutButton already handles its own logic and styling, including navigation on logout */}
      <LogoutButton />
    </div>
  );
};

export default NavigationButtons;