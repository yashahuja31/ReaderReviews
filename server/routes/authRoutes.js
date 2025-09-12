import express from "express";
import { login, register, completeLogin, completeRegistration } from '../controllers/authController.js';
const router = express.Router();

// Initial auth endpoints
router.post('/register', register);
router.post('/login', login);

// OTP verification endpoints
router.post('/complete-registration', completeRegistration);
router.post('/complete-login', completeLogin);

export default router;
