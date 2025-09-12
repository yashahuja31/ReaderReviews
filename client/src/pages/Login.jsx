import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link for navigation
import { loginUser, completeLogin, sendOTP } from "../services/authService";
import { useAuth } from "../contexts/authContext";
import OTPVerification from "../components/OTPVerification";
import './LoginRegister.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // Use null for no error, string for message
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors on new submission
    setLoading(true);
    
    try {
      const response = await loginUser(email, password);
      
      if (response.requiresOTP) {
        setShowOTPVerification(true);
      } else {
        // For backward compatibility if OTP is not required
        login(response);
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerificationSuccess = async (email, otp) => {
    try {
      const userData = await completeLogin(email, otp);
      login(userData);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed. Please try again.");
    }
  };
  
  const handleResendOTP = async () => {
    try {
      await sendOTP(email, "login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend verification code.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        {!showOTPVerification ? (
          <>
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
            <p>
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
          </>
        ) : (
          <OTPVerification 
            email={email} 
            action="login" 
            onVerificationSuccess={handleVerificationSuccess}
            onResendOTP={handleResendOTP}
          />
        )}
      </div>
    </div>
  );
};

export default Login;