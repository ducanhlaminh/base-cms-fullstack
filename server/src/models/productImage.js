const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class ProductImage extends Model {
    static associate(models) {
      // Define associations
      ProductImage.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
      });
    }
  }

  ProductImage.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      alt: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isThumbnail: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      sortOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "ProductImage",
      tableName: "product_images",
      indexes: [{ fields: ["productId"] }],
    }
  );

  return ProductImage;
};
