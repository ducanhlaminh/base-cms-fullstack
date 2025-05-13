const { Model, DataTypes } = require("sequelize");
const slugify = require("slugify");

module.exports = (sequelize) => {
  class Brand extends Model {
    static associate(models) {
      // Define associations
      Brand.hasMany(models.Product, {
        foreignKey: "brandId",
        as: "products",
      });
    }
  }

  Brand.init(
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
          notEmpty: { msg: "Brand name is required" },
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
      logo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isFeatured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "active",
        validate: {
          isIn: [["active", "inactive"]],
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
    },
    {
      sequelize,
      modelName: "Brand",
      tableName: "brands",
      hooks: {
        beforeValidate: (brand) => {
          if (brand.name) {
            brand.slug = slugify(brand.name, {
              lower: true,
              strict: true,
            });
          }
        },
      },
      indexes: [{ fields: ["slug"] }, { fields: ["status"] }],
    }
  );

  return Brand;
};
