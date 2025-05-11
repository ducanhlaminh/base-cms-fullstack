const fs = require("fs");
const path = require("path");
const { sequelize } = require("../config/db");
const Sequelize = require("sequelize");

const basename = path.basename(__filename);
const db = {};

// Import all models from the sequelize directory
fs.readdirSync(path.join(__dirname))
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize);
    db[model.name] = model;
  });

// Associate all models if they have associate method
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
