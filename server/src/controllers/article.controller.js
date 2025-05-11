const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const articleService = require("../services/article.service");
const CustomError = require("../utils/customError");

/**
 * @desc    Get all articles
 * @route   GET /api/articles
 * @access  Public
 */
exports.getAllArticles = asyncHandler(async (req, res) => {
  const result = await articleService.getAllArticles(req.query);

  // Handle response based on whether pagination is returned
  if (result.pagination) {
    res.status(200).json({
      success: true,
      count: result.data.length,
      pagination: result.pagination,
      total: result.pagination.total,
      data: result.data,
    });
  } else {
    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  }
});

/**
 * @desc    Get article by ID
 * @route   GET /api/articles/:id
 * @access  Public
 */
exports.getArticleById = asyncHandler(async (req, res) => {
  const article = await articleService.getArticleById(req.params.id);

  res.status(200).json({
    success: true,
    data: article,
  });
});

/**
 * @desc    Create new article
 * @route   POST /api/articles
 * @access  Private
 */
exports.createArticle = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  // Add author to req.body
  req.body.authorId = req.user.id;

  const article = await articleService.createArticle(req.body);

  res.status(201).json({
    success: true,
    data: article,
  });
});

/**
 * @desc    Update article
 * @route   PUT /api/articles/:id
 * @access  Private
 */
exports.updateArticle = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const article = await articleService.updateArticle(
    req.params.id,
    req.body,
    req.user
  );

  res.status(200).json({
    success: true,
    data: article,
  });
});

/**
 * @desc    Delete article
 * @route   DELETE /api/articles/:id
 * @access  Private
 */
exports.deleteArticle = asyncHandler(async (req, res) => {
  await articleService.deleteArticle(req.params.id, req.user);

  res.status(200).json({
    success: true,
    data: {},
  });
});
