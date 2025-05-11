const { validationResult } = require("express-validator");
const db = require("../models");

// @desc    Get all roles
// @route   GET /api/roles
// @access  Private/Admin
exports.getAllRoles = async (req, res, next) => {
  try {
    const roles = await db.Role.findAll();

    res.status(200).json({
      success: true,
      count: roles.length,
      roles,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get role by ID
// @route   GET /api/roles/:id
// @access  Private/Admin
exports.getRoleById = async (req, res, next) => {
  try {
    const role = await db.Role.findByPk(req.params.id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    res.status(200).json({
      success: true,
      role,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create role
// @route   POST /api/roles
// @access  Private/Admin
exports.createRole = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { name, permissions, description } = req.body;

    // Check if role exists
    const roleExists = await db.Role.findOne({ where: { name } });
    if (roleExists) {
      return res.status(400).json({
        success: false,
        message: "Role already exists",
      });
    }

    // Create role
    const role = await db.Role.create({
      name,
      permissions: permissions || {},
      description: description || "",
    });

    res.status(201).json({
      success: true,
      role,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update role
// @route   PUT /api/roles/:id
// @access  Private/Admin
exports.updateRole = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { name, permissions, description } = req.body;

    // Find role
    const role = await db.Role.findByPk(req.params.id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    // Check if role is admin (cannot update admin role)
    if (
      role.name === db.Role.ROLES.ADMIN &&
      name &&
      name !== db.Role.ROLES.ADMIN
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot update admin role name",
      });
    }

    // Update role
    await role.update({
      name: name || role.name,
      permissions: permissions || role.permissions,
      description: description !== undefined ? description : role.description,
    });

    res.status(200).json({
      success: true,
      role,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete role
// @route   DELETE /api/roles/:id
// @access  Private/Admin
exports.deleteRole = async (req, res, next) => {
  try {
    // Find role
    const role = await db.Role.findByPk(req.params.id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    // Check if role is admin (cannot delete admin role)
    if (role.name === db.Role.ROLES.ADMIN) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete admin role",
      });
    }

    // Check if role is in use
    const usersWithRole = await db.User.count({ where: { roleId: role.id } });
    if (usersWithRole > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete role: ${usersWithRole} users are using this role`,
      });
    }

    // Delete role
    await role.destroy();

    res.status(200).json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
