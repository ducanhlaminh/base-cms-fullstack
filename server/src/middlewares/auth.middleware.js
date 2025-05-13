const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const db = require("../models");
const User = db.User;

/**
 * Middleware for protecting routes
 * Verifies JWT token in the request headers
 * Sets req.user if token is valid
 */
const protect = asyncHandler(async (req, res, next) => {
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

      // Set user in req object (exclude password)
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ["password"] },
        include: [{ model: db.Role, as: "role" }],
      });

      if (!req.user) {
        res.status(401);
        throw new Error("User not found");
      }

      next();
    } catch (error) {
      res.status(401);
      if (error.name === "TokenExpiredError") {
        throw new Error("Token expired, please login again");
      } else if (error.name === "JsonWebTokenError") {
        throw new Error("Invalid token, please login again");
      } else {
        throw new Error("Not authorized, please login again");
      }
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }
});

// Authorize roles - restrict access to certain roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role || !req.user.role.name) {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden: You do not have permission to access this resource",
      });
    }

    if (!roles.includes(req.user.role.name)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role.name} is not authorized to access this resource`,
      });
    }

    next();
  };
};

// Check permissions - restrict access based on resource permissions
const checkPermission = (resource, action) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role || !req.user.role.permissions) {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden: You do not have permission to access this resource",
      });
    }

    // Admin always has access
    if (req.user.role.name === db.Role.ROLES.ADMIN) {
      return next();
    }

    // Check if user has permission
    const permissions = req.user.role.permissions;
    if (!permissions[resource] || !permissions[resource][action]) {
      return res.status(403).json({
        success: false,
        message: `You do not have permission to ${action} ${resource}`,
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize,
  checkPermission,
  default: protect, // For backward compatibility in case anyone is using the default export
};
