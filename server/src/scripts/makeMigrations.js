const path = require("path");
const fs = require("fs");
const { sequelize } = require("../config/db");
const migrationPath = path.resolve(__dirname, "../migrations");
const modelsPath = path.resolve(__dirname, "../models");

// Ensure migrations directory exists
if (!fs.existsSync(migrationPath)) {
  fs.mkdirSync(migrationPath, { recursive: true });
}

// Load all models
const models = {};
fs.readdirSync(modelsPath)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file.slice(-3) === ".js" && file !== "index.js"
    );
  })
  .forEach((file) => {
    const modelPath = path.join(modelsPath, file);
    const model = require(modelPath)(sequelize);
    models[model.name] = model;
  });

// Create migration schema
const createMigrationSchema = async () => {
  const schema = { tables: {} };

  // Process each model
  Object.keys(models).forEach((modelName) => {
    const model = models[modelName];
    const tableName = model.tableName || model.name.toLowerCase() + "s";

    schema.tables[tableName] = {
      tableName: tableName,
      schema: "public",
      attributes: {},
      indexes: [],
    };

    // Process attributes
    Object.keys(model.rawAttributes).forEach((attributeName) => {
      const attribute = model.rawAttributes[attributeName];

      schema.tables[tableName].attributes[attributeName] = {
        primaryKey: attribute.primaryKey || false,
        autoIncrement: attribute.autoIncrement || false,
        allowNull:
          attribute.allowNull === undefined ? true : attribute.allowNull,
        defaultValue: attribute.defaultValue,
        type: attribute.type.key,
        unique: attribute.unique || false,
        references: attribute.references
          ? {
              model: attribute.references.model,
              key: attribute.references.key,
            }
          : null,
      };
    });

    // Process indexes
    if (model.options.indexes && model.options.indexes.length > 0) {
      model.options.indexes.forEach((index) => {
        schema.tables[tableName].indexes.push({
          name: index.name || null,
          unique: index.unique || false,
          fields: index.fields,
          using: index.using || "BTREE",
        });
      });
    }
  });

  return schema;
};

// Write migration schema to file
const writeMigrationSchema = async () => {
  try {
    const schema = await createMigrationSchema();
    const timestamp = new Date()
      .toISOString()
      .replace(/\D/g, "")
      .substring(0, 14);
    const currentSchemaPath = path.join(migrationPath, "_current.json");
    const migrationFilePath = path.join(
      migrationPath,
      `${timestamp}-migration.js`
    );

    // Write current schema
    fs.writeFileSync(currentSchemaPath, JSON.stringify(schema, null, 2));

    // Create migration file
    const migrationContent = `'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      ${Object.keys(schema.tables)
        .map((tableName) => {
          const table = schema.tables[tableName];
          return `
      // Create table: ${tableName}
      await queryInterface.createTable('${tableName}', {
        ${Object.keys(table.attributes)
          .map((attrName) => {
            const attr = table.attributes[attrName];
            return `${attrName}: {
          type: Sequelize.${attr.type},
          allowNull: ${attr.allowNull},
          ${attr.primaryKey ? "primaryKey: true," : ""}
          ${attr.autoIncrement ? "autoIncrement: true," : ""}
          ${
            attr.defaultValue !== undefined
              ? `defaultValue: ${JSON.stringify(attr.defaultValue)},`
              : ""
          }
          ${attr.unique ? "unique: true," : ""}
          ${
            attr.references
              ? `references: {
            model: '${attr.references.model}',
            key: '${attr.references.key}'
          },`
              : ""
          }
        }`;
          })
          .join(",\n        ")}
      }, { transaction });`;
        })
        .join("\n      ")}
      
      ${
        schema.tables &&
        Object.keys(schema.tables)
          .map((tableName) => {
            const table = schema.tables[tableName];
            if (table.indexes && table.indexes.length) {
              return table.indexes
                .map((index) => {
                  return `
      // Add index to ${tableName}
      await queryInterface.addIndex('${tableName}', ${JSON.stringify(
                    index.fields
                  )}, {
        name: ${index.name ? `'${index.name}'` : "undefined"},
        using: '${index.using || "BTREE"}',
        unique: ${index.unique || false},
        transaction
      });`;
                })
                .join("\n      ");
            }
            return "";
          })
          .join("\n      ")
      }
      
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      ${Object.keys(schema.tables)
        .reverse()
        .map((tableName) => {
          return `await queryInterface.dropTable('${tableName}', { transaction });`;
        })
        .join("\n      ")}
      
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
`;

    fs.writeFileSync(migrationFilePath, migrationContent);
    console.log(`Migration file created: ${migrationFilePath}`);
  } catch (error) {
    console.error("Error generating migrations:", error);
  }
};

writeMigrationSchema().finally(() => {
  sequelize.close();
  console.log("Migration generation complete.");
});
