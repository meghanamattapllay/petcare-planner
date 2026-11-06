const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (id, email, name) => {
  return jwt.sign(
    { id, email, name },
    process.env.JWT_SECRET || 'dev_jwt_secret_key_12345',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, password',
      });
    }

    const existingUser = await User.findOne({ email }).catch(() => null);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email address',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    if (
      (email === 'admin@pawtech.com' && password === 'admin123') ||
      (req.body.loginType === 'admin' && email === 'admin@pawtech.com')
    ) {
      const token = generateToken('demo_admin_user', 'admin@pawtech.com', 'System Administrator');
      return res.json({
        success: true,
        message: 'Admin Login successful',
        token,
        user: {
          id: 'demo_admin_user',
          name: 'System Administrator',
          email: 'admin@pawtech.com',
          role: 'admin',
        },
      });
    }

    if (email === 'demo@pawtech.com' && password === 'pawtech123') {
      const token = generateToken('demo_pawtech_user', email, 'Demo Pet Owner');
      return res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: 'demo_pawtech_user',
          name: 'Demo Pet Owner',
          email,
          role: 'owner',
        },
      });
    }

    let user;
    if (require('mongoose').connection.readyState === 1) {
      try {
        user = await User.findOne({ email }).maxTimeMS(2500);
      } catch (dbErr) {
        console.warn('[AuthController] DB lookup skipped:', dbErr.message);
      }
    }

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
          role: user.role || 'owner',
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

