const asyncHandler = require("express-async-handler");

/**
 * Role-based middleware to restrict access to specific roles
 * @param {Array} roles - Array of allowed roles
 * @returns {function} - Express middleware function
 */
const roleMiddleware = (roles = []) => {
  return asyncHandler(async (req, res, next) => {
    // Check if user exists and has a role
    if (!req.user || !req.user.role) {
      res.status(403);
      throw new Error("You do not have permission to perform this action");
    }

    // Allow if user role is in the allowed roles
    if (roles.includes(req.user.role.name)) {
      return next();
    }

    res.status(403);
    throw new Error("You do not have permission to perform this action");
  });
};

module.exports = roleMiddleware;
