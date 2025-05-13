const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const db = require("../models");
const User = db.User;

/**
 * Middleware that optionally authenticates user based on token
 * If token is valid, adds user to req.user
 * If token is invalid or missing, continues without error
 */
const optionalAuthMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Set user in req object
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ["password"] },
        include: [{ model: db.Role, as: "role" }],
      });

      next();
    } catch (error) {
      // Continue without authenticated user
      req.user = null;
      next();
    }
  } else {
    // Continue without authenticated user
    req.user = null;

    // Use sessionId for guest users
    if (!req.session) {
      req.session = {};
    }

    // Set sessionId if not already set
    if (!req.session.id) {
      req.session.id =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
    }

    next();
  }
});

module.exports = optionalAuthMiddleware;
