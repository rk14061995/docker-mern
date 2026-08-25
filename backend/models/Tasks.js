const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    id: { type: Number, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    status: { type: String, default: "Pending", trim: true }
}, { timestamps: true });
module.exports = mongoose.model('Tasks', taskSchema);
