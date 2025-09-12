import { useState } from 'react';
import { verifyOTP } from '../services/authService';
import './OTPVerification.css';

const OTPVerification = ({ email, action, onVerificationSuccess, onResendOTP }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await verifyOTP(email, otp, action);
      onVerificationSuccess(email, otp);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-container">
      <h3>Verification Code</h3>
      <p>Please enter the verification code sent to {email}</p>
      
      {error && <p className="error-message">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="otp-input-group">
          <input
            type="text"
            placeholder="Enter verification code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength="6"
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>
      
      <p className="resend-link">
        Didn't receive the code? <button onClick={onResendOTP} className="resend-button">Resend</button>
      </p>
    </div>
  );
};

export default OTPVerification;