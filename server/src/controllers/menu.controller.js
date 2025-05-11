const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const menuService = require("../services/menu.service");
const CustomError = require("../utils/customError");

/**
 * @desc    Get all menus
 * @route   GET /api/menus
 * @access  Public
 */
exports.getAllMenus = asyncHandler(async (req, res) => {
  const menus = await menuService.getAllMenus();

  res.status(200).json({
    success: true,
    count: Array.isArray(menus) ? menus.length : menus.data.length,
    data: menus.data || menus,
  });
});

/**
 * @desc    Get menu by ID
 * @route   GET /api/menus/:id
 * @access  Public
 */
exports.getMenuById = asyncHandler(async (req, res) => {
  const menu = await menuService.getMenuById(req.params.id);

  res.status(200).json({
    success: true,
    data: menu,
  });
});

/**
 * @desc    Get menu by location
 * @route   GET /api/menus/location/:location
 * @access  Public
 */
exports.getMenuByLocation = asyncHandler(async (req, res) => {
  const menu = await menuService.getMenuByLocation(req.params.location);

  res.status(200).json({
    success: true,
    data: menu,
  });
});

/**
 * @desc    Create new menu
 * @route   POST /api/menus
 * @access  Private/Admin
 */
exports.createMenu = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  // Add user to req.body
  req.body.createdById = req.user.id;

  const menu = await menuService.createMenu(req.body);

  res.status(201).json({
    success: true,
    data: menu,
  });
});

/**
 * @desc    Update menu
 * @route   PUT /api/menus/:id
 * @access  Private/Admin
 */
exports.updateMenu = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const menu = await menuService.updateMenu(req.params.id, req.body);

  res.status(200).json({
    success: true,
    data: menu,
  });
});

/**
 * @desc    Delete menu
 * @route   DELETE /api/menus/:id
 * @access  Private/Admin
 */
exports.deleteMenu = asyncHandler(async (req, res) => {
  await menuService.deleteMenu(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});
