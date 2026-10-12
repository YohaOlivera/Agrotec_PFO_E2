const path = require("path");
const dotenv = require("dotenv");

const envFile =
  process.env.NODE_ENV === "production" ? "prod.env" : ".env";
const envPath = path.join(__dirname, envFile);
const { error } = dotenv.config({ path: envPath, quiet: true });

if (error) {
  throw error;
}

if (!process.env.MONGO_URI) {
  throw new Error(`MONGO_URI must be set in ${envFile}`);
}

require("./config/mongo-dns")();

module.exports = {
  mongodb: {
    url: process.env.MONGO_URI,
    databaseName: process.env.MONGO_DB_NAME || "agrotec",
  },
  migrationsDir: path.join(__dirname, "migrations"),
  changelogCollectionName: "changelog",
  migrationFileExtension: ".js",
  moduleSystem: "commonjs",
};
