const fs = require('fs');
const mongoose = require('mongoose');
const mongoDBPassword = fs.readFileSync(process.env.MONGO_PASSWORD,"utf8").trim();

const mongoUsername= process.env.MONGO_USERNAME;
const mongoDB = process.env.MONGO_DB;

const MONGO_URI = `mongodb://${mongoUsername}:${encodeURIComponent(mongoPassword)}:@monogodb:27017/${mongoDB}?authSoucrce=admin`;

mongoose.connect(MONGO_URI).then(()=>{
	console.log("MongoDB Connected..");
}).catch((error)=>{
	console.log(`MongoDB Connection Failed: `,error);
});
