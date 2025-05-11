const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Menu extends Model {
    static associate(models) {
      // Define associations
      Menu.belongsTo(models.User, {
        foreignKey: "createdById",
        as: "createdBy",
      });
    }
  }

  Menu.init(
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
          notEmpty: { msg: "Menu name is required" },
        },
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Menu location is required" },
        },
        comment:
          "Location where this menu is displayed (e.g., 'header', 'footer', 'sidebar')",
      },
      items: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
        comment: "Array of menu items with structure and nesting",
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
      modelName: "Menu",
      tableName: "menus",
      timestamps: true,
    }
  );

  return Menu;
};
