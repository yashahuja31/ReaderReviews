// Register.jsx (Similar structure to Login.jsx)
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, completeRegistration, sendOTP } from "../services/authService";
import { useAuth } from "../contexts/authContext";
import OTPVerification from "../components/OTPVerification";
import './LoginRegister.css';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // For success message
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // If you auto-login after register

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null); // Clear messages
    setLoading(true);
    
    try {
      const response = await registerUser(name, email, password);
      
      if (response.requiresOTP) {
        setShowOTPVerification(true);
      } else {
        // For backward compatibility if OTP is not required
        setSuccess("Registration successful! You can now log in.");
        login(response);
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerificationSuccess = async (email, otp) => {
    try {
      const userData = await completeRegistration(email, otp);
      setSuccess("Registration successful! You are now logged in.");
      login(userData);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed. Please try again.");
    }
  };
  
  const handleResendOTP = async () => {
    try {
      await sendOTP(email, "register");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend verification code.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        {!showOTPVerification ? (
          <>
            <h2>Register</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
                {loading ? "Registering..." : "Register"}
              </button>
            </form>
            <p>
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </>
        ) : (
          <OTPVerification 
            email={email} 
            action="register" 
            onVerificationSuccess={handleVerificationSuccess}
            onResendOTP={handleResendOTP}
          />
        )}
      </div>
    </div>
  );
};

export default Register;