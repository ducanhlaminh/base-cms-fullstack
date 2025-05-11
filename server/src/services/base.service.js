/**
 * Base service class providing common CRUD operations
 */
class BaseService {
  /**
   * Create a new service instance
   * @param {Object} model - The Sequelize model
   */
  constructor(model) {
    this.model = model;
    this.modelName = model.name;
  }

  /**
   * Find all records with optional filtering, pagination, and associations
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of records
   */
  async findAll(options = {}) {
    const { page, limit, ...queryOptions } = options;

    // Handle pagination
    if (page && limit) {
      const offset = (page - 1) * limit;
      queryOptions.limit = limit;
      queryOptions.offset = offset;
    }

    const items = await this.model.findAll(queryOptions);

    if (page && limit) {
      const total = await this.model.count(
        queryOptions.where ? { where: queryOptions.where } : {}
      );

      // Pagination object
      const pagination = {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(total / limit),
      };

      return {
        data: items,
        pagination,
      };
    }

    return items;
  }

  /**
   * Find record by primary key with optional associations
   * @param {string|number} id - Primary key
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Found record
   */
  async findById(id, options = {}) {
    const item = await this.model.findByPk(id, options);

    if (!item) {
      throw new Error(`${this.modelName} not found with id: ${id}`);
    }

    return item;
  }

  /**
   * Find one record matching conditions
   * @param {Object} conditions - Where conditions
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Found record
   */
  async findOne(conditions, options = {}) {
    const item = await this.model.findOne({
      where: conditions,
      ...options,
    });

    if (!item) {
      throw new Error(`${this.modelName} not found`);
    }

    return item;
  }

  /**
   * Create a new record
   * @param {Object} data - Data to create
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Created record
   */
  async create(data, options = {}) {
    return this.model.create(data, options);
  }

  /**
   * Update record by primary key
   * @param {string|number} id - Primary key
   * @param {Object} data - Data to update
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Updated record
   */
  async update(id, data, options = {}) {
    const item = await this.findById(id);
    return item.update(data, options);
  }

  /**
   * Delete record by primary key
   * @param {string|number} id - Primary key
   * @param {Object} options - Additional options
   * @returns {Promise<boolean>} Success status
   */
  async delete(id, options = {}) {
    const item = await this.findById(id);
    await item.destroy(options);
    return true;
  }

  /**
   * Count records matching conditions
   * @param {Object} conditions - Where conditions
   * @returns {Promise<number>} Count of records
   */
  async count(conditions = {}) {
    return this.model.count({
      where: conditions,
    });
  }
}

module.exports = BaseService;
