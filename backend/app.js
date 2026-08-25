require('dotenv').config();
const app = require('./server');
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
const fs = require('fs');
const mongoUsername =  process.env.MONGO_USERNAME;
const mongoPassword = fs.readFileSync(process.env.MONGO_PASSWORD_FILE,"utf8").trim();
const MONGO_DB=process.env.MONGO_DB;
const MONGO_URI = `mongodb://${mongoUsername}:${encodeURIComponent(mongoPassword)}@mongodb:27017/${MONGO_DB}?authSource=admin`;
console.log(' MONGO URI : ', MONGO_URI);
app.get('/health',(req, res)=>{
	const mongoshStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
	const isHealthy = mongoshStatus === "connected";
	res.status(isHealthy ? 200 : 503).json({
		status:isHealthy ? "healthy" : "unhealthy",
		server: "Running - DEV",
		database: mongoshStatus,
		timestamp: new Date().toISOString(),
});
});

mongoose.connect(MONGO_URI).then(() => {
	console.log(`Mongoose Connected Successfully.`);
	app.listen(port, () => {
		console.log(`Server is running at ${port}`);
	});

}).catch((error) => { console.log(` Error : ${error}`) });
