const jwt = require('jsonwebtoken');
const getJwtSecret = require('../config/jwt');

const protect = (req, res, next) => {
  const authorization = req.get('authorization');
  const bearerMatch =
    typeof authorization === 'string'
      ? authorization.match(/^Bearer\s+(\S+)$/i)
      : null;

  if (!bearerMatch) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no bearer token provided',
    });
  }

  let secret;
  try {
    secret = getJwtSecret();
  } catch (error) {
    return next(error);
  }

  try {
    const decoded = jwt.verify(bearerMatch[1], secret);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token validation failed',
    });
  }
};

module.exports = { protect };
