import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';
import { storeTempUser, getTempUser, removeTempUser } from '../utils/tempUserStore.js';
import { sendOTPEmail } from '../utils/emailService.js';

// Step 1: Initiate registration process
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Store user data temporarily
    storeTempUser(email, { name, email, password });

    // Send OTP
    const sent = await sendOTPEmail(email, 'register');
    if (!sent) {
      return res.status(500).json({ message: 'Failed to send verification code' });
    }

    res.status(200).json({ 
      message: 'Verification code sent to your email',
      requiresOTP: true,
      email
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Step 2: Complete registration after OTP verification
export const completeRegistration = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Get temporary user data
    const userData = getTempUser(email);
    if (!userData) {
      return res.status(400).json({ message: 'Registration session expired or invalid' });
    }
    
    // Create the user
    const user = await User.create({
      name: userData.name,
      email: userData.email,
      password: userData.password
    });
    
    // Remove temporary data
    removeTempUser(email);
    
    // Return user data with token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user)
    });
  } catch (error) {
    console.error('Complete registration error:', error);
    res.status(500).json({ message: 'Server error completing registration' });
  }
};

// Step 1: Initiate login process
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Store user info temporarily (just the email is enough for login)
    storeTempUser(email, { userId: user._id });

    // Send OTP
    const sent = await sendOTPEmail(email, 'login');
    if (!sent) {
      return res.status(500).json({ message: 'Failed to send verification code' });
    }

    res.status(200).json({ 
      message: 'Verification code sent to your email',
      requiresOTP: true,
      email
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Step 2: Complete login after OTP verification
export const completeLogin = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Get temporary user data
    const userData = getTempUser(email);
    if (!userData) {
      return res.status(400).json({ message: 'Login session expired or invalid' });
    }
    
    // Get the user
    const user = await User.findById(userData.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove temporary data
    removeTempUser(email);
    
    // Return user data with token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user)
    });
  } catch (error) {
    console.error('Complete login error:', error);
    res.status(500).json({ message: 'Server error completing login' });
  }
};
