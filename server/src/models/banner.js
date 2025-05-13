const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Banner extends Model {
    static associate(models) {
      // No direct associations for banners
    }
  }

  Banner.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      linkUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      position: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "home_top",
      },
      sortOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      buttonText: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING,
        validate: {
          isIn: [["main_slider", "promotion", "category", "sidebar", "popup"]],
        },
        defaultValue: "main_slider",
      },
      device: {
        type: DataTypes.STRING,
        validate: {
          isIn: [["all", "desktop", "mobile"]]
        },
        defaultValue: "all",
      },
      bgColor: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      textColor: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Banner",
      tableName: "banners",
      indexes: [
        { fields: ["position"] },
        { fields: ["type"] },
        { fields: ["isActive"] },
      ],
    }
  );

  return Banner;
};
