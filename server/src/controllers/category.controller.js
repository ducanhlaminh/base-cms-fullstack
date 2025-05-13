const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");
const db = require("../models");
const Category = db.Category;

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.findAll({
    include: [
      {
        model: Category,
        as: "children",
        include: [
          {
            model: Category,
            as: "children",
          },
        ],
      },
    ],
    where: {
      parentId: null,
    },
    order: [
      ["sortOrder", "ASC"],
      [{ model: Category, as: "children" }, "sortOrder", "ASC"],
      [
        { model: Category, as: "children" },
        { model: Category, as: "children" },
        "sortOrder",
        "ASC",
      ],
    ],
  });

  res.json({
    success: true,
    categories,
  });
});

/**
 * @desc    Get category by ID
 * @route   GET /api/categories/:id
 * @access  Public
 */
exports.getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id, {
    include: [
      {
        model: Category,
        as: "children",
        include: [
          {
            model: Category,
            as: "children",
          },
        ],
      },
      {
        model: Category,
        as: "parent",
      },
    ],
  });

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.json({
    success: true,
    category,
  });
});

/**
 * @desc    Get category by slug
 * @route   GET /api/categories/slug/:slug
 * @access  Public
 */
exports.getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({
    where: { slug: req.params.slug },
    include: [
      {
        model: Category,
        as: "children",
        include: [
          {
            model: Category,
            as: "children",
          },
        ],
      },
      {
        model: Category,
        as: "parent",
      },
    ],
  });

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.json({
    success: true,
    category,
  });
});

/**
 * @desc    Create new category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
exports.createCategory = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    name,
    description,
    parentId,
    sortOrder,
    isFeatured,
    status,
    metaTitle,
    metaDescription,
  } = req.body;

  // Check if parent category exists if parentId is provided
  if (parentId) {
    const parentCategory = await Category.findByPk(parentId);
    if (!parentCategory) {
      res.status(400);
      throw new Error("Parent category not found");
    }
  }

  // Create category
  const category = await Category.create({
    name,
    description,
    parentId: parentId || null,
    image: req.file ? `/uploads/categories/${req.file.filename}` : null,
    icon: req.body.icon || null,
    sortOrder: sortOrder || 0,
    isFeatured: isFeatured || false,
    status: status || "active",
    metaTitle: metaTitle || name,
    metaDescription: metaDescription || description,
  });

  res.status(201).json({
    success: true,
    category,
  });
});

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  const {
    name,
    description,
    parentId,
    icon,
    sortOrder,
    isFeatured,
    status,
    metaTitle,
    metaDescription,
  } = req.body;

  // Check if parent category exists if parentId is provided
  if (parentId && parentId !== category.parentId) {
    // Check for circular reference - can't set a child as parent
    const childCategories = await getAllChildIds(category.id);
    if (childCategories.includes(parentId)) {
      res.status(400);
      throw new Error(
        "Cannot set a child category as parent (circular reference)"
      );
    }

    const parentCategory = await Category.findByPk(parentId);
    if (!parentCategory) {
      res.status(400);
      throw new Error("Parent category not found");
    }
  }

  // Update image if new file is uploaded
  let image = category.image;
  if (req.file) {
    // Delete old image if exists
    if (category.image) {
      const oldImagePath = path.join(__dirname, "../../", category.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    image = `/uploads/categories/${req.file.filename}`;
  }

  // Update category
  await category.update({
    name: name || category.name,
    description: description || category.description,
    parentId: parentId !== undefined ? parentId : category.parentId,
    image,
    icon: icon !== undefined ? icon : category.icon,
    sortOrder: sortOrder !== undefined ? sortOrder : category.sortOrder,
    isFeatured: isFeatured !== undefined ? isFeatured : category.isFeatured,
    status: status || category.status,
    metaTitle: metaTitle || category.metaTitle,
    metaDescription: metaDescription || category.metaDescription,
  });

  const updatedCategory = await Category.findByPk(req.params.id, {
    include: [
      {
        model: Category,
        as: "parent",
      },
      {
        model: Category,
        as: "children",
      },
    ],
  });

  res.json({
    success: true,
    category: updatedCategory,
  });
});

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  // Check if category has children
  const childCategories = await Category.findAll({
    where: { parentId: category.id },
  });

  if (childCategories.length > 0) {
    res.status(400);
    throw new Error(
      "Cannot delete category with children. Delete child categories first."
    );
  }

  // Check if category has products
  const productCount = await db.Product.count({
    where: { categoryId: category.id },
  });

  if (productCount > 0) {
    res.status(400);
    throw new Error(
      `Cannot delete category with products. This category has ${productCount} products.`
    );
  }

  // Delete image if exists
  if (category.image) {
    const imagePath = path.join(__dirname, "../../", category.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  // Delete category
  await category.destroy();

  res.json({
    success: true,
    message: "Category deleted successfully",
  });
});

/**
 * @desc    Get featured categories
 * @route   GET /api/categories/featured
 * @access  Public
 */
exports.getFeaturedCategories = asyncHandler(async (req, res) => {
  const categories = await Category.findAll({
    where: {
      isFeatured: true,
      status: "active",
    },
    include: [
      {
        model: Category,
        as: "children",
        where: { status: "active" },
        required: false,
      },
    ],
    order: [["sortOrder", "ASC"]],
  });

  res.json({
    success: true,
    categories,
  });
});

// Helper function to get all child category IDs recursively
async function getAllChildIds(categoryId) {
  const childIds = [];
  const children = await Category.findAll({
    where: { parentId: categoryId },
  });

  for (const child of children) {
    childIds.push(child.id);
    const grandChildren = await getAllChildIds(child.id);
    childIds.push(...grandChildren);
  }

  return childIds;
}
