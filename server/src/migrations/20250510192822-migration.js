'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      
      // Create table: articles
      await queryInterface.createTable('articles', {
        id: {
          type: Sequelize.UUID,
          allowNull: true,
          primaryKey: true,
          
          defaultValue: {},
          
          
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false,
          
          
          
          
          
        },
        slug: {
          type: Sequelize.STRING,
          allowNull: false,
          
          
          
          unique: true,
          
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: false,
          
          
          
          
          
        },
        excerpt: {
          type: Sequelize.TEXT,
          allowNull: true,
          
          
          
          
          
        },
        featuredImage: {
          type: Sequelize.STRING,
          allowNull: true,
          
          
          defaultValue: "",
          
          
        },
        categoryId: {
          type: Sequelize.UUID,
          allowNull: false,
          
          
          
          
          references: {
            model: 'categories',
            key: 'id'
          },
        },
        tags: {
          type: Sequelize.ARRAY,
          allowNull: true,
          
          
          defaultValue: [],
          
          
        },
        authorId: {
          type: Sequelize.UUID,
          allowNull: false,
          
          
          
          
          references: {
            model: 'users',
            key: 'id'
          },
        },
        status: {
          type: Sequelize.ENUM,
          allowNull: true,
          
          
          defaultValue: "draft",
          
          
        },
        publishedAt: {
          type: Sequelize.DATE,
          allowNull: true,
          
          
          
          
          
        },
        featured: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          
          
          defaultValue: false,
          
          
        },
        views: {
          type: Sequelize.INTEGER,
          allowNull: true,
          
          
          defaultValue: 0,
          
          
        },
        lastEditedById: {
          type: Sequelize.UUID,
          allowNull: true,
          
          
          
          
          references: {
            model: 'users',
            key: 'id'
          },
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          
          
          
          
          
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          
          
          
          
          
        }
      }, { transaction });
      
      // Create table: categories
      await queryInterface.createTable('categories', {
        id: {
          type: Sequelize.UUID,
          allowNull: true,
          primaryKey: true,
          
          defaultValue: {},
          
          
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          
          
          
          unique: true,
          
        },
        slug: {
          type: Sequelize.STRING,
          allowNull: false,
          
          
          
          unique: true,
          
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
          
          
          
          
          
        },
        parentId: {
          type: Sequelize.UUID,
          allowNull: true,
          
          
          
          
          references: {
            model: 'categories',
            key: 'id'
          },
        },
        image: {
          type: Sequelize.STRING,
          allowNull: true,
          
          
          defaultValue: "",
          
          
        },
        order: {
          type: Sequelize.INTEGER,
          allowNull: true,
          
          
          defaultValue: 0,
          
          
        },
        createdById: {
          type: Sequelize.UUID,
          allowNull: false,
          
          
          
          
          references: {
            model: 'users',
            key: 'id'
          },
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          
          
          
          
          
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          
          
          
          
          
        }
      }, { transaction });
      
      // Create table: menus
      await queryInterface.createTable('menus', {
        id: {
          type: Sequelize.UUID,
          allowNull: true,
          primaryKey: true,
          
          defaultValue: {},
          
          
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          
          
          
          
          
        },
        location: {
          type: Sequelize.STRING,
          allowNull: false,
          
          
          
          
          
        },
        items: {
          type: Sequelize.JSONB,
          allowNull: false,
          
          
          defaultValue: [],
          
          
        },
        active: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          
          
          defaultValue: true,
          
          
        },
        order: {
          type: Sequelize.INTEGER,
          allowNull: true,
          
          
          defaultValue: 0,
          
          
        },
        createdById: {
          type: Sequelize.UUID,
          allowNull: false,
          
          
          
          
          references: {
            model: 'users',
            key: 'id'
          },
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          
          
          
          
          
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          
          
          
          
          
        }
      }, { transaction });
      
      // Create table: users
      await queryInterface.createTable('users', {
        id: {
          type: Sequelize.UUID,
          allowNull: true,
          primaryKey: true,
          
          defaultValue: {},
          
          
        },
        firstName: {
          type: Sequelize.STRING,
          allowNull: false,
          
          
          
          
          
        },
        lastName: {
          type: Sequelize.STRING,
          allowNull: false,
          
          
          
          
          
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          
          
          
          unique: true,
          
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
          
          
          
          
          
        },
        roleId: {
          type: Sequelize.UUID,
          allowNull: false,
          
          
          
          
          references: {
            model: 'roles',
            key: 'id'
          },
        },
        avatar: {
          type: Sequelize.STRING,
          allowNull: true,
          
          
          defaultValue: "",
          
          
        },
        bio: {
          type: Sequelize.TEXT,
          allowNull: true,
          
          
          defaultValue: "",
          
          
        },
        isActive: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          
          
          defaultValue: true,
          
          
        },
        lastLogin: {
          type: Sequelize.DATE,
          allowNull: true,
          
          
          
          
          
        },
        passwordResetToken: {
          type: Sequelize.STRING,
          allowNull: true,
          
          
          
          
          
        },
        passwordResetExpires: {
          type: Sequelize.DATE,
          allowNull: true,
          
          
          
          
          
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          
          
          
          
          
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          
          
          
          
          
        }
      }, { transaction });
      
      
      // Add index to articles
      await queryInterface.addIndex('articles', ["slug"], {
        name: 'articles_slug',
        using: 'BTREE',
        unique: false,
        transaction
      });
      
      // Add index to articles
      await queryInterface.addIndex('articles', ["status","publishedAt"], {
        name: 'articles_status_published_at',
        using: 'BTREE',
        unique: false,
        transaction
      });
      
      // Add index to articles
      await queryInterface.addIndex('articles', ["authorId"], {
        name: 'articles_author_id',
        using: 'BTREE',
        unique: false,
        transaction
      });
      
      // Add index to articles
      await queryInterface.addIndex('articles', ["categoryId"], {
        name: 'articles_category_id',
        using: 'BTREE',
        unique: false,
        transaction
      });
      
      
      
      
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('users', { transaction });
      await queryInterface.dropTable('menus', { transaction });
      await queryInterface.dropTable('categories', { transaction });
      await queryInterface.dropTable('articles', { transaction });
      
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
