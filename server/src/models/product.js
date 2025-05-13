const { Model, DataTypes } = require("sequelize");
const slugify = require("slugify");

module.exports = (sequelize) => {
  class Product extends Model {
    static associate(models) {
      // Define associations
      Product.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
      });
      Product.belongsTo(models.Brand, {
        foreignKey: "brandId",
        as: "brand",
      });
      Product.hasMany(models.ProductImage, {
        foreignKey: "productId",
        as: "images",
      });
      Product.hasMany(models.ProductVariant, {
        foreignKey: "productId",
        as: "variants",
      });
    }
  }

  Product.init(
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
          notEmpty: { msg: "Product name is required" },
        },
      },
      slug: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      shortDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      salePrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          min: 0,
        },
      },
      costPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          min: 0,
        },
      },
      sku: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "categories",
          key: "id",
        },
      },
      brandId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "brands",
          key: "id",
        },
      },
      featuredImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isFeatured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isNew: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      averageRating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      reviewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      specifications: {
        type: DataTypes.JSONB,
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      weight: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      dimensions: {
        type: DataTypes.JSONB,
      },
      warranty: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "draft",
        validate: {
          isIn: [["draft", "active", "discontinued"]],
        },
      },
      metaTitle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      metaDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      viewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "products",
      hooks: {
        beforeValidate: (product) => {
          if (product.name) {
            product.slug = slugify(product.name, {
              lower: true,
              strict: true,
            });
          }

          // Generate SKU if not provided
          if (!product.sku && product.isNewRecord) {
            const randomStr = Math.random()
              .toString(36)
              .substring(2, 7)
              .toUpperCase();
            product.sku = `PRD-${randomStr}`;
          }
        },
      },
      indexes: [
        { fields: ["slug"] },
        { fields: ["categoryId"] },
        { fields: ["brandId"] },
        { fields: ["status"] },
        { fields: ["sku"] },
      ],
    }
  );

  return Product;
};
