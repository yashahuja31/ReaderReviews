
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom"; 

const LogoutButton = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); 

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  if (!user) return null; 

  return (
    <button
      onClick={handleLogout} 
      
      style={{
        padding: "10px 15px",
        backgroundColor: "#dc3545", 
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        transition: "background-color 0.3s ease",
      }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#c82333'} // Darker red on hover
      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#dc3545'}
    >
      Logout
    </button>
  );
};

export default LogoutButton;