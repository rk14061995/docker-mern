const express = require('express');
const cors = require('cors');
const app = express();

const taskRoute = require('./routes/taskRoutes.js');
app.use(cors());
app.use(express.json());
app.use('/api/tasks/',taskRoute);
app.get('/',(req, res)=>{
	res.json('Server Health Is Good...');
});


module.exports = app;
