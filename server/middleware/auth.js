const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { getJwtSecret } = require("../config/jwt");

function getBearerToken(header) {
  const match = header.match(/^Bearer\s+(\S+)$/i);
  return match ? match[1] : null;
}

function isUserToken(payload) {
  return payload && typeof payload === "object" && typeof payload.sub === "string";
}

async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = getBearerToken(header);
  if (!token) {
    return res.status(401).json({ message: "Authentication is required." });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, getJwtSecret(), { algorithms: ["HS256"] });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Your session has expired. Please sign in again." });
    }
    return next(error);
  }

  if (!isUserToken(decoded)) {
    return res.status(401).json({ message: "Your session has expired. Please sign in again." });
  }

  try {
    const user = await User.findById(decoded.sub);
    if (!user) {
      return res.status(401).json({ message: "Your session has expired. Please sign in again." });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email
    };
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = { requireAuth };
