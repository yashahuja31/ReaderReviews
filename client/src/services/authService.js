import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Login a user - Step 1: Initiate login
export const loginUser = async (email, password) => {
  const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
  return res.data;
};

// Login a user - Step 2: Complete login with OTP
export const completeLogin = async (email, otp) => {
  const res = await axios.post(`${API_URL}/api/auth/complete-login`, { email, otp });
  return res.data;
};

// Register a new user - Step 1: Initiate registration
export const registerUser = async (name, email, password) => {
  const res = await axios.post(`${API_URL}/api/auth/register`, { name, email, password });
  return res.data;
};

// Register a new user - Step 2: Complete registration with OTP
export const completeRegistration = async (email, otp) => {
  const res = await axios.post(`${API_URL}/api/auth/complete-registration`, { email, otp });
  return res.data;
};

// Send OTP for verification
export const sendOTP = async (email, action) => {
  const res = await axios.post(`${API_URL}/api/otp/send`, { email, action });
  return res.data;
};

// Verify OTP
export const verifyOTP = async (email, otp, action) => {
  const res = await axios.post(`${API_URL}/api/otp/verify`, { email, otp, action });
  return res.data;
};
