const db = require("../models");
const bcrypt = require("bcryptjs");

/**
 * Initializes the database with default roles and an admin user
 */
const initDatabase = async () => {
  try {
    console.log("Starting database initialization...");

    // Create default roles if they don't exist
    const roles = [
      {
        name: db.Role.ROLES.ADMIN,
        description: "Administrator with full access",
        permissions: {
          articles: {
            create: true,
            read: true,
            update: true,
            delete: true,
            publish: true,
          },
          categories: {
            create: true,
            read: true,
            update: true,
            delete: true,
          },
          users: {
            create: true,
            read: true,
            update: true,
            delete: true,
          },
          roles: {
            create: true,
            read: true,
            update: true,
            delete: true,
          },
          media: {
            upload: true,
            manage: true,
          },
        },
      },
      {
        name: db.Role.ROLES.EDITOR,
        description: "Editor with content management privileges",
        permissions: {
          articles: {
            create: true,
            read: true,
            update: true,
            delete: true,
            publish: true,
          },
          categories: {
            create: true,
            read: true,
            update: true,
            delete: false,
          },
          users: {
            create: false,
            read: true,
            update: false,
            delete: false,
          },
          roles: {
            create: false,
            read: true,
            update: false,
            delete: false,
          },
          media: {
            upload: true,
            manage: true,
          },
        },
      },
      {
        name: db.Role.ROLES.WRITER,
        description: "Writer with content creation privileges",
        permissions: {
          articles: {
            create: true,
            read: true,
            update: true,
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
            upload: true,
            manage: false,
          },
        },
      },
      {
        name: db.Role.ROLES.SUBSCRIBER,
        description: "Subscriber with read-only access",
        permissions: {
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
    ];

    for (const role of roles) {
      const [createdRole, created] = await db.Role.findOrCreate({
        where: { name: role.name },
        defaults: role,
      });

      if (created) {
        console.log(`Role '${role.name}' created successfully`);
      } else {
        console.log(`Role '${role.name}' already exists`);
      }
    }

    // Create admin user if it doesn't exist
    const adminRole = await db.Role.findOne({
      where: { name: db.Role.ROLES.ADMIN },
    });

    if (adminRole) {
      const adminExists = await db.User.findOne({
        where: { email: "admin@example.com" },
      });

      if (!adminExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password", salt);

        await db.User.create({
          firstName: "Admin",
          lastName: "User",
          email: "admin@example.com",
          password: hashedPassword,
          roleId: adminRole.id,
          isActive: true,
        });

        console.log("Admin user created successfully");
      } else {
        console.log("Admin user already exists");
      }
    }

    console.log("Database initialization completed");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

module.exports = initDatabase;
