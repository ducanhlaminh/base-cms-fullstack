const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Role extends Model {
    static associate(models) {
      // Define associations
      Role.hasMany(models.User, { foreignKey: "roleId", as: "users" });
    }

    // Check if user has permission
    hasPermission(resource, action) {
      if (this.name === Role.ROLES.ADMIN) return true;
      return this.permissions[resource]?.[action] || false;
    }
  }

  Role.init(
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
          notEmpty: { msg: "Role name is required" },
        },
      },
      permissions: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {
          articles: {
            create: false,
            read: true,
            update: false,
            delete: false,
            publish: false,
          },
          categories: {
            create: false,
            read: true,
            update: false,
            delete: false,
          },
          users: {
            create: false,
            read: false,
            update: false,
            delete: false,
          },
          roles: {
            create: false,
            read: false,
            update: false,
            delete: false,
          },
          media: {
            upload: false,
            manage: false,
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Role",
      tableName: "roles",
    }
  );

  // Define predefined roles
  Role.ROLES = {
    ADMIN: "admin",
    EDITOR: "editor",
    WRITER: "writer",
    SUBSCRIBER: "subscriber",
  };

  return Role;
};
