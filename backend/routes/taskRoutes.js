const express = require('express');
const router = express.Router();
const taskModel = require('../models/Tasks.js');

//To fetch the tasks list
router.get('/list', async (req, res) => {
	try {
		const tasks = await taskModel.find().sort({ created_at: -1 });
		res.status(200).json({ message: "Tasks Fetched Successfully", tasks: tasks });
	} catch (error) {
		res.statusCode = 500;
		res.json({ message: "Something Went Wrong", error: error });
	}

	const tasks = await taskModel.find().sort({ created_at: -1 });
});

//To Create New Task
router.post('/create', async (req, res) => {
	const { id, title } = req.body;
	try {
		const sendData = await taskModel.create({ id, title });
		if (sendData) { res.status(200).json({ msg: "Task Created Successfully" }) } else { res.status(500).json({ msg: "Failed to insert" }) }
	} catch (error) {
		res.status(500).json({ error });
	}
	res.json({ id, title })
});
module.exports = router;

