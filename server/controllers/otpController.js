import { sendOTPEmail, verifyOTP as verifyOTPService } from '../utils/emailService.js';

// Controller to send OTP
export const sendOTP = async (req, res) => {
  try {
    const { email, action } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    if (!action || (action !== 'register' && action !== 'login')) {
      return res.status(400).json({ message: 'Valid action (register or login) is required' });
    }
    
    const sent = await sendOTPEmail(email, action);
    
    if (sent) {
      res.status(200).json({ message: 'OTP sent successfully' });
    } else {
      res.status(500).json({ message: 'Failed to send OTP' });
    }
  } catch (error) {
    console.error('Error in sendOTP controller:', error);
    res.status(500).json({ message: 'Server error while sending OTP' });
  }
};

// Controller to verify OTP
export const verifyOTP = (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }
    
    const result = verifyOTPService(email, otp);
    
    if (result.valid) {
      res.status(200).json({ 
        valid: true, 
        action: result.action,
        message: 'OTP verified successfully' 
      });
    } else {
      res.status(400).json({ 
        valid: false, 
        message: result.message 
      });
    }
  } catch (error) {
    console.error('Error in verifyOTP controller:', error);
    res.status(500).json({ message: 'Server error while verifying OTP' });
  }
};