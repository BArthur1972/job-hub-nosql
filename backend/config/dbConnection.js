require('dotenv').config();
const mongoose = require('mongoose');

const dbUrl = "mongodb://localhost:27017/jobhub";

mongoose.connect(dbUrl).catch((err) => console.log(err.message));

// Validate DB connection
const dbConnection = mongoose.connection;
dbConnection.on("error", console.error.bind(console, "connection error: "));
dbConnection.once("open", function () {
	console.log("Connected to Mongo DB");
});

module.exports = dbConnection;