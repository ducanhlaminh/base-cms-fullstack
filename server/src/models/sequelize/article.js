const { Model, DataTypes } = require("sequelize");
const slugify = require("slugify");

module.exports = (sequelize) => {
  class Article extends Model {
    static associate(models) {
      // Define associations
      Article.belongsTo(models.User, { foreignKey: "authorId", as: "author" });
      Article.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
      });
      Article.belongsTo(models.User, {
        foreignKey: "lastEditedById",
        as: "lastEditedBy",
      });
    }
  }

  Article.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Article title is required" },
        },
      },
      slug: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Article content is required" },
        },
      },
      excerpt: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      featuredImage: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "categories",
          key: "id",
        },
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      authorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      status: {
        type: DataTypes.ENUM("draft", "published", "archived"),
        defaultValue: "draft",
      },
      publishedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      lastEditedById: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Article",
      tableName: "articles",
      hooks: {
        beforeValidate: (article) => {
          if (article.title) {
            article.slug = slugify(article.title, {
              lower: true,
              strict: true,
            });
          }
        },
        beforeUpdate: (article) => {
          // Set published date if status is changed to published
          if (
            article.changed("status") &&
            article.status === "published" &&
            !article.publishedAt
          ) {
            article.publishedAt = new Date();
          }
        },
        beforeCreate: (article) => {
          // Set published date if creating a published article
          if (article.status === "published" && !article.publishedAt) {
            article.publishedAt = new Date();
          }
        },
      },
      indexes: [
        { fields: ["slug"] },
        { fields: ["status", "publishedAt"] },
        { fields: ["authorId"] },
        { fields: ["categoryId"] },
      ],
    }
  );

  return Article;
};
