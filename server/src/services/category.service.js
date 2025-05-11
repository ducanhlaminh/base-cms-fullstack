const BaseService = require("./base.service");
const models = require("../models");
const CustomError = require("../utils/customError");

/**
 * Category service class
 */
class CategoryService extends BaseService {
  constructor() {
    super(models.Category);
  }

  /**
   * Get all categories with appropriate includes
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of categories
   */
  async getAllCategories(options = {}) {
    const queryOptions = {
      include: [
        {
          model: models.User,
          as: "createdBy",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: models.Category,
          as: "parent",
          attributes: ["id", "name", "slug"],
        },
      ],
      order: [["order", "ASC"]],
      ...options,
    };

    return this.findAll(queryOptions);
  }

  /**
   * Get category by id with related data
   * @param {string} id - Category id
   * @returns {Promise<Object>} Category object
   */
  async getCategoryById(id) {
    const options = {
      include: [
        {
          model: models.User,
          as: "createdBy",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: models.Category,
          as: "parent",
          attributes: ["id", "name", "slug"],
        },
        {
          model: models.Category,
          as: "subcategories",
          attributes: ["id", "name", "slug", "description", "image", "order"],
        },
      ],
    };

    try {
      return await this.findById(id, options);
    } catch (error) {
      throw new CustomError("Category not found", 404);
    }
  }

  /**
   * Create a new category
   * @param {Object} data - Category data
   * @returns {Promise<Object>} Created category
   */
  async createCategory(data) {
    return this.create(data);
  }

  /**
   * Update a category
   * @param {string} id - Category id
   * @param {Object} data - Category data
   * @returns {Promise<Object>} Updated category
   */
  async updateCategory(id, data) {
    try {
      return await this.update(id, data);
    } catch (error) {
      throw new CustomError("Category not found", 404);
    }
  }

  /**
   * Delete a category
   * @param {string} id - Category id
   * @returns {Promise<boolean>} Success status
   */
  async deleteCategory(id) {
    try {
      // Check if category has articles
      const articleCount = await models.Article.count({
        where: { categoryId: id },
      });

      if (articleCount > 0) {
        throw new CustomError(
          "Cannot delete category that has articles. Reassign articles first.",
          400
        );
      }

      // Check if category has subcategories
      const subcategoryCount = await models.Category.count({
        where: { parentId: id },
      });

      if (subcategoryCount > 0) {
        throw new CustomError(
          "Cannot delete category that has subcategories. Delete subcategories first.",
          400
        );
      }

      await this.delete(id);
      return true;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Category not found", 404);
    }
  }
}

module.exports = new CategoryService();
