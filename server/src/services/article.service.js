const BaseService = require("./base.service");
const models = require("../models");
const CustomError = require("../utils/customError");

/**
 * Article service class
 */
class ArticleService extends BaseService {
  constructor() {
    super(models.Article);
  }

  /**
   * Get all articles with filtering and pagination
   * @param {Object} queryParams - Query parameters
   * @returns {Promise<Object>} Articles with pagination
   */
  async getAllArticles(queryParams = {}) {
    const { page = 1, limit = 10, categoryId, status } = queryParams;

    // Filtering
    const where = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (status) {
      where.status = status;
    }

    const queryOptions = {
      where,
      include: [
        {
          model: models.User,
          as: "author",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: models.Category,
          as: "category",
          attributes: ["id", "name", "slug"],
        },
      ],
      order: [["createdAt", "DESC"]],
      page,
      limit,
    };

    return this.findAll(queryOptions);
  }

  /**
   * Get article by id
   * @param {string} id - Article id
   * @returns {Promise<Object>} Article object
   */
  async getArticleById(id) {
    const options = {
      include: [
        {
          model: models.User,
          as: "author",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: models.Category,
          as: "category",
          attributes: ["id", "name", "slug"],
        },
      ],
    };

    try {
      return await this.findById(id, options);
    } catch (error) {
      throw new CustomError("Article not found", 404);
    }
  }

  /**
   * Create a new article
   * @param {Object} data - Article data
   * @returns {Promise<Object>} Created article
   */
  async createArticle(data) {
    return this.create(data);
  }

  /**
   * Update an article
   * @param {string} id - Article id
   * @param {Object} data - Article data
   * @param {Object} user - Current user
   * @returns {Promise<Object>} Updated article
   */
  async updateArticle(id, data, user) {
    try {
      const article = await this.findById(id);

      // Check if user is article author or admin
      if (
        article.authorId.toString() !== user.id.toString() &&
        user.role !== "admin"
      ) {
        throw new CustomError("Not authorized to update this article", 403);
      }

      return await article.update(data);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Article not found", 404);
    }
  }

  /**
   * Delete an article
   * @param {string} id - Article id
   * @param {Object} user - Current user
   * @returns {Promise<boolean>} Success status
   */
  async deleteArticle(id, user) {
    try {
      const article = await this.findById(id);

      // Check if user is article author or admin
      if (
        article.authorId.toString() !== user.id.toString() &&
        user.role !== "admin"
      ) {
        throw new CustomError("Not authorized to delete this article", 403);
      }

      await article.destroy();
      return true;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Article not found", 404);
    }
  }
}

module.exports = new ArticleService();
