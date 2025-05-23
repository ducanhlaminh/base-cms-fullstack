const { Model, DataTypes } = require("sequelize");
const slugify = require("slugify");

module.exports = (sequelize) => {
  class Category extends Model {
    static associate(models) {
      // Self-referencing relationship for nested categories
      Category.belongsTo(Category, {
        foreignKey: "parentId",
        as: "parent",
      });

      Category.hasMany(Category, {
        foreignKey: "parentId",
        as: "children",
      });

      // Define associations
      Category.hasMany(models.Product, {
        foreignKey: "categoryId",
        as: "products",
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
      },
      icon: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      sortOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      isFeatured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: DataTypes.STRING,
        validate: {
          isIn: [["active", "inactive"]],
        },
        defaultValue: "active",
      },
      metaTitle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      metaDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
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
      indexes: [
        { fields: ["slug"] },
        { fields: ["parentId"] },
        { fields: ["status"] },
      ],
    }
  );

  return Category;
};
