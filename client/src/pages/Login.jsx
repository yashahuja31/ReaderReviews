import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link for navigation
import { loginUser } from "../services/authService";
import { useAuth } from "../contexts/authContext";
import './LoginRegister.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // Use null for no error, string for message
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors on new submission
    try {
      const userData = await loginUser(email, password);
      login(userData);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>} {/* Apply error-message class */}
        <form onSubmit={handleSubmit}>
          <div className="input-group"> {/* Wrap input in a div for potential future enhancements (icons) */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group"> {/* Wrap input in a div */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;