const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const config = require("../config/db.config");

const db = {};

// Create a new Sequelize instance
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: config.logging,
  }
);

// Import all model files
fs.readdirSync(__dirname)
  .filter((file) => file !== "index.js" && file !== "sequelize")
  .forEach((file) => {
    console.log(file);
    const model = require(path.join(__dirname, file))(sequelize);
    db[model.name] = model;
  });

// Set up model associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
