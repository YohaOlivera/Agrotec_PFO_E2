const mongoose = require("mongoose");
//const configureMongoDns = require("./mongo-dns");

const connectDB = async () => {
  //configureMongoDns();
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.MONGO_DB_NAME || "agrotec",
  });
  console.log(`MongoDB Conectado: ${conn.connection.host}`);
};

module.exports = connectDB;
