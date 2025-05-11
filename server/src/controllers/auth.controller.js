const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const db = require("../models");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { firstName, lastName, email, password } = req.body;

    // Check if user exists
    const userExists = await db.User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Get subscriber role
    let role = await db.Role.findOne({
      where: { name: db.Role.ROLES.SUBSCRIBER },
    });

    // If no subscriber role exists, create it
    if (!role) {
      role = await db.Role.create({
        name: db.Role.ROLES.SUBSCRIBER,
        description: "Subscriber role",
      });
    }

    // Create user
    const user = await db.User.create({
      firstName,
      lastName,
      email,
      password,
      roleId: role.id,
    });

    // Generate token
    const token = generateToken(user.id);

    // Update last login
    await user.update({ lastLogin: new Date() });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: {
          id: role.id,
          name: role.name,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await db.User.findOne({
      where: { email },
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
        message: "Invalid credentials",
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Your account has been deactivated",
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Update last login
    await user.update({ lastLogin: new Date() });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: {
          id: user.role.id,
          name: user.role.name,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await db.User.findByPk(req.user.id, {
      include: {
        model: db.Role,
        as: "role",
        attributes: ["id", "name", "permissions"],
      },
      attributes: { exclude: ["password"] },
    });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
