const mongoose = require('mongoose');

const dns =require("dns");

dns.setServers(["8.8.8.8"]);

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/Note-App`);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
