const jwt = require('jsonwebtoken');

/**
 * Authentication & Authorization Middleware
 * Assigned to: CHIPPA VASU (Backend: Authentication - Roll: 2303A51618)
 * Coordinated by: Godishala Kruthik Roshan (Integration - Roll: 2303A52339)
 */

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'dev_jwt_secret_key_12345'
      );

      // Attach user payload to request
      req.user = decoded;
      return next();
    } catch (error) {
      console.error('[AuthMiddleware] Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token validation failed',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no bearer token provided',
    });
  }
};

module.exports = { protect };

