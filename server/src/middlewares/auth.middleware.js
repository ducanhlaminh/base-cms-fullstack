const jwt = require("jsonwebtoken");
const db = require("../models");

// Protect routes - only authenticated users can access
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check if token is in the headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by id
      const user = await db.User.findByPk(decoded.id, {
        include: {
          model: db.Role,
          as: "role",
          attributes: ["id", "name", "permissions"],
        },
      });

      // Check if user exists
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "The user belonging to this token no longer exists",
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Your account has been deactivated",
        });
      }

      // Set user in request object
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }
  } catch (error) {
    next(error);
  }
};

// Authorize roles - restrict access to certain roles
exports.authorize = (...roles) => {
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
exports.checkPermission = (resource, action) => {
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
