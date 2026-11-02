const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { getJwtSecret } = require("../config/jwt");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_SALT_ROUNDS = 12;
const MAX_PASSWORD_BYTES = 72;
const INVALID_CREDENTIALS_MESSAGE = "Email or password is incorrect.";

function requestBody(req) {
  const body = req.body;
  return body && typeof body === "object" && !Array.isArray(body) ? body : {};
}

function normalizeEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function isValidEmail(email) {
  return email.length <= 254 && EMAIL_PATTERN.test(email);
}

function publicUser(user) {
  return { name: user.name, email: user.email };
}

function createToken(user) {
  return jwt.sign({}, getJwtSecret(), {
    algorithm: "HS256",
    subject: user._id.toString(),
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
}

router.post("/register", async (req, res, next) => {
  const body = requestBody(req);
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = normalizeEmail(body.email);
  const password = body.password;

  if (!name || name.length > 80 || !isValidEmail(email)) {
    return res.status(400).json({ message: "Enter a name of at most 80 characters and a valid email address." });
  }
  if (typeof password !== "string" || password.length < 8 || Buffer.byteLength(password, "utf8") > MAX_PASSWORD_BYTES) {
    return res.status(400).json({ message: "Password must be at least 8 characters and no more than 72 bytes." });
  }

  try {
    if (await User.exists({ email })) {
      return res.status(409).json({ message: "An account with that email already exists." });
    }

    const user = await User.create({
      name,
      email,
      passwordHash: await bcrypt.hash(password, PASSWORD_SALT_ROUNDS)
    });
    return res.status(201).json({
      token: createToken(user),
      user: publicUser(user)
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "An account with that email already exists." });
    }
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const body = requestBody(req);
  const email = normalizeEmail(body.email);
  const password = body.password;

  if (!email || typeof password !== "string") {
    return res.status(400).json({ message: "Email and password are required." });
  }
  if (Buffer.byteLength(password, "utf8") > MAX_PASSWORD_BYTES) {
    return res.status(401).json({ message: INVALID_CREDENTIALS_MESSAGE });
  }

  try {
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: INVALID_CREDENTIALS_MESSAGE });
    }

    return res.json({
      token: createToken(user),
      user: publicUser(user)
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
