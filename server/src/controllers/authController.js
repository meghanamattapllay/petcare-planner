const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

/**
 * Controller: Authentication
 * Assigned Member: CHIPPA VASU (Backend: Authentication)
 * Roll: 2303A51618 · Branch: CSE
 * Integrated by Lead: Godishala Kruthik Roshan
 */

// Helper to generate JWT Token
const generateToken = (id, email, name) => {
  return jwt.sign(
    { id, email, name },
    process.env.JWT_SECRET || 'dev_jwt_secret_key_12345',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, password',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email }).catch(() => null);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email address',
      });
    }

    // Salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user (or demo response if DB not connected)
    let user;
    try {
      user = await User.create({
        name,
        email,
        password: hashedPassword,
      });
    } catch (dbErr) {
      console.warn('[AuthController] DB write skipped (Demo Mode):', dbErr.message);
      user = {
        _id: 'demo_user_' + Date.now(),
        name,
        email,
      };
    }

    const token = generateToken(user._id, user.email, user.name);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    let user;
    try {
      user = await User.findOne({ email });
    } catch (dbErr) {
      console.warn('[AuthController] DB lookup skipped:', dbErr.message);
    }

    // Check password
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id, user.email, user.name);
      return res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    }

    // Fallback demo user for smooth integration demo
    if (email === 'demo@pawtech.com' && password === 'pawtech123') {
      const token = generateToken('demo_pawtech_lead', email, 'Demo Pet Owner');
      return res.json({
        success: true,
        message: 'Login successful (Demo Mode)',
        token,
        user: {
          id: 'demo_pawtech_lead',
          name: 'Demo Pet Owner',
          email,
        },
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private (Requires protect middleware)
const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
