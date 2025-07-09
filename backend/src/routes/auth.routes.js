import express from 'express';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  verifyOTP,
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';
import { authLimiter, loginLimiter } from '../middleware/rateLimiter.js';
import {
  validateRegister,
  validateLogin,
  handleValidationErrors,
  sanitizeInput,
} from '../middleware/validation.js';

const router = express.Router();

// Apply input sanitization to all routes
router.use(sanitizeInput);

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  authLimiter, // Rate limiting for registration
  validateRegister, // Input validation
  handleValidationErrors, // Handle validation errors
  registerUser
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  loginLimiter, // Stricter rate limiting for login
  validateLogin, // Input validation
  handleValidationErrors, // Handle validation errors
  loginUser
);

// @route   POST /api/auth/verify-otp
// @desc    Verify email with OTP
// @access  Public
router.post(
  '/verify-otp',
  authLimiter, // Rate limiting for OTP verification
  verifyOTP
);

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, getCurrentUser);

export default router;
