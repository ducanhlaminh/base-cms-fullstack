const express = require("express");
const { check } = require("express-validator");
const articleController = require("../controllers/article.controller");
const {
  protect,
  authorize,
  checkPermission,
} = require("../middlewares/auth.middleware");

const router = express.Router();

// @route   GET /api/articles
// @desc    Get all articles
// @access  Public
router.get("/", articleController.getAllArticles);

// @route   GET /api/articles/:id
// @desc    Get article by id
// @access  Public
router.get("/:id", articleController.getArticleById);

// Protect all routes below
router.use(protect);

// @route   POST /api/articles
// @desc    Create an article
// @access  Private
router.post(
  "/",
  authorize("admin", "editor", "author"),
  checkPermission("articles", "create"),
  [
    check("title", "Title is required").notEmpty(),
    check("content", "Content is required").notEmpty(),
    check("categoryId", "Category ID is required").notEmpty(),
    check("status", "Status must be one of: draft, published, archived")
      .optional()
      .isIn(["draft", "published", "archived"]),
    check("featuredImage", "Featured image must be a string")
      .optional()
      .isString(),
    check("tags", "Tags must be an array").optional().isArray(),
  ],
  articleController.createArticle
);

// @route   PUT /api/articles/:id
// @desc    Update an article
// @access  Private
router.put(
  "/:id",
  authorize("admin", "editor", "author"),
  checkPermission("articles", "update"),
  [
    check("title", "Title cannot be empty").optional().notEmpty(),
    check("content", "Content cannot be empty").optional().notEmpty(),
    check("status", "Status must be one of: draft, published, archived")
      .optional()
      .isIn(["draft", "published", "archived"]),
    check("featuredImage", "Featured image must be a string")
      .optional()
      .isString(),
    check("tags", "Tags must be an array").optional().isArray(),
  ],
  articleController.updateArticle
);

// @route   DELETE /api/articles/:id
// @desc    Delete an article
// @access  Private
router.delete(
  "/:id",
  authorize("admin", "editor"),
  checkPermission("articles", "delete"),
  articleController.deleteArticle
);

module.exports = router;
