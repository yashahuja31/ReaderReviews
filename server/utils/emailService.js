import nodemailer from 'nodemailer';

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Store OTPs with expiration (in memory for now, in production use Redis or similar)
const otpStore = new Map();

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
export const sendOTPEmail = async (email, action) => {
  try {
    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiration
    
    // Store OTP with expiration
    otpStore.set(email, { otp, expiresAt, action });
    
    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Your OTP for ${action === 'register' ? 'Registration' : 'Login'} - ReaderReviews`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #4A90E2;">ReaderReviews - Verification Code</h2>
          <p>Hello,</p>
          <p>Your verification code for ${action === 'register' ? 'registration' : 'login'} is:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
            ${otp}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <p>Thank you,<br>ReaderReviews Team</p>
        </div>
      `,
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
};

// Verify OTP
export const verifyOTP = (email, otp) => {
  const otpData = otpStore.get(email);
  
  if (!otpData) {
    return { valid: false, message: 'No OTP found for this email' };
  }
  
  if (Date.now() > otpData.expiresAt) {
    otpStore.delete(email); // Clean up expired OTP
    return { valid: false, message: 'OTP has expired' };
  }
  
  if (otpData.otp !== otp) {
    return { valid: false, message: 'Invalid OTP' };
  }
  
  // OTP is valid, clean up
  otpStore.delete(email);
  return { valid: true, action: otpData.action };
};