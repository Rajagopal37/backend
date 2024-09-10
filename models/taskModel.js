const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: "Not Completed" },
  assignDate: { type: Date, required: true },
  lastDate: { type: Date, required: true },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
