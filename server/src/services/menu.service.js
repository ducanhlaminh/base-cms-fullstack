const BaseService = require("./base.service");
const models = require("../models");
const CustomError = require("../utils/customError");

/**
 * Menu service class
 */
class MenuService extends BaseService {
  constructor() {
    super(models.Menu);
  }

  /**
   * Get all menus with appropriate includes
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of menus
   */
  async getAllMenus(options = {}) {
    const queryOptions = {
      include: [
        {
          model: models.User,
          as: "createdBy",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
      order: [["order", "ASC"]],
      ...options,
    };

    return this.findAll(queryOptions);
  }

  /**
   * Get menu by id with related data
   * @param {string} id - Menu id
   * @returns {Promise<Object>} Menu object
   */
  async getMenuById(id) {
    const options = {
      include: [
        {
          model: models.User,
          as: "createdBy",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    };

    try {
      return await this.findById(id, options);
    } catch (error) {
      throw new CustomError("Menu not found", 404);
    }
  }

  /**
   * Get menu by location
   * @param {string} location - Menu location (e.g., 'header', 'footer')
   * @returns {Promise<Object>} Menu object
   */
  async getMenuByLocation(location) {
    try {
      const menu = await this.model.findOne({
        where: { location, active: true },
        order: [["order", "ASC"]],
        include: [
          {
            model: models.User,
            as: "createdBy",
            attributes: ["id", "firstName", "lastName"],
          },
        ],
      });

      if (!menu) {
        throw new CustomError(
          `No active menu found for location: ${location}`,
          404
        );
      }

      return menu;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        `Error fetching menu for location: ${location}`,
        500
      );
    }
  }

  /**
   * Create a new menu
   * @param {Object} data - Menu data
   * @returns {Promise<Object>} Created menu
   */
  async createMenu(data) {
    return this.create(data);
  }

  /**
   * Update a menu
   * @param {string} id - Menu id
   * @param {Object} data - Menu data
   * @returns {Promise<Object>} Updated menu
   */
  async updateMenu(id, data) {
    try {
      return await this.update(id, data);
    } catch (error) {
      throw new CustomError("Menu not found", 404);
    }
  }

  /**
   * Delete a menu
   * @param {string} id - Menu id
   * @returns {Promise<boolean>} Success status
   */
  async deleteMenu(id) {
    try {
      await this.delete(id);
      return true;
    } catch (error) {
      throw new CustomError("Menu not found", 404);
    }
  }
}

module.exports = new MenuService();
