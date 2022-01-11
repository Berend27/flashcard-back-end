const path = require("path");

require("dotenv").config();

const {
  NODE_ENV = "development",
  DEV_URL,
  PROD_URL,
} = process.env;

const URL =
  NODE_ENV === "production"
    ? PROD_URL
    : DEV_URL;

module.exports = {

  development: {
    client: "postgresql",
    connection: URL,
    pool: { min: 0, max: 5 },
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
  },

  production: {
    client: "postgresql",
    connection: URL,
    pool: { min: 0, max: 5 },
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
  },

};
