const { Model, DataTypes } = require("sequelize");
const slugify = require("slugify");

module.exports = (sequelize) => {
  class Category extends Model {
    static associate(models) {
      // Define associations
      Category.belongsTo(models.User, {
        foreignKey: "createdById",
        as: "createdBy",
      });
      Category.hasMany(models.Article, {
        foreignKey: "categoryId",
        as: "articles",
      });
      Category.belongsTo(models.Category, {
        foreignKey: "parentId",
        as: "parent",
      });
      Category.hasMany(models.Category, {
        foreignKey: "parentId",
        as: "subcategories",
      });
    }
  }

  Category.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: { msg: "Category name is required" },
        },
      },
      slug: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      parentId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "categories",
          key: "id",
        },
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      createdById: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Category",
      tableName: "categories",
      hooks: {
        beforeValidate: (category) => {
          if (category.name) {
            category.slug = slugify(category.name, {
              lower: true,
              strict: true,
            });
          }
        },
      },
    }
  );

  return Category;
};
