const dotenv = require("dotenv");
const app = require("./app");
const { sequelize, connectDB } = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to the database and start the server
const startServer = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Sync database models (create tables if they don't exist)
    await sequelize.drop();
    await sequelize.sync({ force: true });
    console.log("Database synchronized");

    // Initialize database with default data
    // if (process.env.NODE_ENV === "development") {
    //   console.log("Starting database initialization...");
    //   await initDatabase();
    //   console.log("Database initialization completed");
    // }

    // Start the server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
