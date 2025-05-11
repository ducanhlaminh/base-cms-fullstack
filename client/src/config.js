const config = {
  development: {
    apiBaseUrl: "http://localhost:8080/api",
    timeout: 10000,
  },
  production: {
    apiBaseUrl: "/api", // Uses relative path in production (assumes same-origin deployment)
    timeout: 15000,
  },
};

// Determine the current environment
const env = import.meta.env.MODE || "development";

export default config[env];
