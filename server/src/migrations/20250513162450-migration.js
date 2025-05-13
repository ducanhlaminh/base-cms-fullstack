"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Create table: banners
      await queryInterface.createTable(
        "banners",
        {
          id: {
            type: Sequelize.UUID,
            allowNull: true,
            primaryKey: true,
          },
          title: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          imageUrl: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          linkUrl: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          position: {
            type: Sequelize.STRING,
            allowNull: false,

            defaultValue: "home_top",
          },
          sortOrder: {
            type: Sequelize.INTEGER,
            allowNull: true,

            defaultValue: 0,
          },
          startDate: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          endDate: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: true,

            defaultValue: true,
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          buttonText: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          type: {
            type: Sequelize.STRING,
            allowNull: true,

            defaultValue: "main_slider",
          },
          device: {
            type: Sequelize.STRING,
            allowNull: true,

            defaultValue: "all",
          },
          bgColor: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          textColor: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
        },
        { transaction }
      );

      // Create table: brands
      await queryInterface.createTable(
        "brands",
        {
          id: {
            type: Sequelize.UUID,
            allowNull: true,
            primaryKey: true,
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
          logo: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          website: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          isFeatured: {
            type: Sequelize.BOOLEAN,
            allowNull: true,

            defaultValue: false,
          },
          status: {
            type: Sequelize.STRING,
            allowNull: true,

            defaultValue: "active",
          },
          metaTitle: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          metaDescription: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
        },
        { transaction }
      );

      // Create table: categories
      await queryInterface.createTable(
        "categories",
        {
          id: {
            type: Sequelize.UUID,
            allowNull: true,
            primaryKey: true,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
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
              model: "categories",
              key: "id",
            },
          },
          image: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          icon: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          sortOrder: {
            type: Sequelize.INTEGER,
            allowNull: true,

            defaultValue: 0,
          },
          isFeatured: {
            type: Sequelize.BOOLEAN,
            allowNull: true,

            defaultValue: false,
          },
          status: {
            type: Sequelize.STRING,
            allowNull: true,

            defaultValue: "active",
          },
          metaTitle: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          metaDescription: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
        },
        { transaction }
      );

      // Create table: products
      await queryInterface.createTable(
        "products",
        {
          id: {
            type: Sequelize.UUID,
            allowNull: true,
            primaryKey: true,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          slug: {
            type: Sequelize.STRING,
            allowNull: false,

            unique: true,
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          shortDescription: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          price: {
            type: Sequelize.DECIMAL,
            allowNull: false,
          },
          salePrice: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          costPrice: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          sku: {
            type: Sequelize.STRING,
            allowNull: false,

            unique: true,
          },
          quantity: {
            type: Sequelize.INTEGER,
            allowNull: false,

            defaultValue: 0,
          },
          isAvailable: {
            type: Sequelize.BOOLEAN,
            allowNull: true,

            defaultValue: true,
          },
          categoryId: {
            type: Sequelize.UUID,
            allowNull: false,

            references: {
              model: "categories",
              key: "id",
            },
          },
          brandId: {
            type: Sequelize.UUID,
            allowNull: true,

            references: {
              model: "brands",
              key: "id",
            },
          },
          featuredImage: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          isFeatured: {
            type: Sequelize.BOOLEAN,
            allowNull: true,

            defaultValue: false,
          },
          isNew: {
            type: Sequelize.BOOLEAN,
            allowNull: true,

            defaultValue: false,
          },
          averageRating: {
            type: Sequelize.FLOAT,
            allowNull: true,

            defaultValue: 0,
          },
          reviewCount: {
            type: Sequelize.INTEGER,
            allowNull: true,

            defaultValue: 0,
          },
          specifications: {
            type: Sequelize.JSONB,
            allowNull: true,
          },
          tags: {
            type: Sequelize.ARRAY(Sequelize.STRING),
            allowNull: true,
            defaultValue: [],
          },
          weight: {
            type: Sequelize.FLOAT,
            allowNull: true,
          },
          dimensions: {
            type: Sequelize.JSONB,
            allowNull: true,
          },
          warranty: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          status: {
            type: Sequelize.STRING,
            allowNull: true,

            defaultValue: "draft",
          },
          metaTitle: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          metaDescription: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          viewCount: {
            type: Sequelize.INTEGER,
            allowNull: true,

            defaultValue: 0,
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
        },
        { transaction }
      );

      // Create table: product_images
      await queryInterface.createTable(
        "product_images",
        {
          id: {
            type: Sequelize.UUID,
            allowNull: true,
            primaryKey: true,
          },
          productId: {
            type: Sequelize.UUID,
            allowNull: false,

            references: {
              model: "products",
              key: "id",
            },
          },
          url: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          alt: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          isThumbnail: {
            type: Sequelize.BOOLEAN,
            allowNull: true,

            defaultValue: false,
          },
          sortOrder: {
            type: Sequelize.INTEGER,
            allowNull: true,

            defaultValue: 0,
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
        },
        { transaction }
      );

      // Create table: product_variants
      await queryInterface.createTable(
        "product_variants",
        {
          id: {
            type: Sequelize.UUID,
            allowNull: true,
            primaryKey: true,
          },
          productId: {
            type: Sequelize.UUID,
            allowNull: false,

            references: {
              model: "products",
              key: "id",
            },
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          sku: {
            type: Sequelize.STRING,
            allowNull: false,

            unique: true,
          },
          price: {
            type: Sequelize.DECIMAL,
            allowNull: false,
          },
          salePrice: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          quantity: {
            type: Sequelize.INTEGER,
            allowNull: false,

            defaultValue: 0,
          },
          isAvailable: {
            type: Sequelize.BOOLEAN,
            allowNull: true,

            defaultValue: true,
          },
          attributes: {
            type: Sequelize.JSONB,
            allowNull: true,
          },
          image: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
        },
        { transaction }
      );

      // Add index to banners
      await queryInterface.addIndex("banners", ["position"], {
        name: "banners_position",
        using: "BTREE",
        unique: false,
        transaction,
      });

      // Add index to banners
      await queryInterface.addIndex("banners", ["type"], {
        name: "banners_type",
        using: "BTREE",
        unique: false,
        transaction,
      });

      // Add index to banners
      await queryInterface.addIndex("banners", ["isActive"], {
        name: "banners_is_active",
        using: "BTREE",
        unique: false,
        transaction,
      });

      // Add index to brands
      await queryInterface.addIndex("brands", ["slug"], {
        name: "brands_slug",
        using: "BTREE",
        unique: false,
        transaction,
      });

      // Add index to brands
      await queryInterface.addIndex("brands", ["status"], {
        name: "brands_status",
        using: "BTREE",
        unique: false,
        transaction,
      });

      // Add index to categories
      await queryInterface.addIndex("categories", ["slug"], {
        name: "categories_slug",
        using: "BTREE",
        unique: false,
        transaction,
      });

      // Add index to categories
      await queryInterface.addIndex("categories", ["parentId"], {
        name: "categories_parent_id",
        using: "BTREE",
        unique: false,
        transaction,
      });

      // Add index to categories
      await queryInterface.addIndex("categories", ["status"], {
        name: "categories_status",
        using: "BTREE",
        unique: false,
        transaction,
      });

      // Add index to products
      await queryInterface.addIndex("products", ["slug"], {
        name: "products_slug",
        using: "BTREE",
        unique: false,
        transaction,
      });

      // Add index to products
      await queryInterface.addIndex("products", ["categoryId"], {
        name: "products_category_id",
        using: "BTREE",
        unique: false,
        transaction,
      });

      // Add index to products
      await queryInterface.addIndex("products", ["brandId"], {
        name: "products_brand_id",
        using: "BTREE",
        unique: false,
        transaction,
      });

      // Add index to products
      await queryInterface.addIndex("products", ["status"], {
        name: "products_status",
        using: "BTREE",
        unique: false,
        transaction,
      });

      // Add index to products
      await queryInterface.addIndex("products", ["sku"], {
        name: "products_sku",
        using: "BTREE",
        unique: false,
        transaction,
      });

      // Add index to product_images
      await queryInterface.addIndex("product_images", ["productId"], {
        name: "product_images_product_id",
        using: "BTREE",
        unique: false,
        transaction,
      });

      // Add index to product_variants
      await queryInterface.addIndex("product_variants", ["productId"], {
        name: "product_variants_product_id",
        using: "BTREE",
        unique: false,
        transaction,
      });

      // Add index to product_variants
      await queryInterface.addIndex("product_variants", ["sku"], {
        name: "product_variants_sku",
        using: "BTREE",
        unique: false,
        transaction,
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
      await queryInterface.dropTable("product_variants", { transaction });
      await queryInterface.dropTable("product_images", { transaction });
      await queryInterface.dropTable("products", { transaction });
      await queryInterface.dropTable("categories", { transaction });
      await queryInterface.dropTable("brands", { transaction });
      await queryInterface.dropTable("banners", { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
