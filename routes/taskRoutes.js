const express = require("express");
const Task = require("../models/taskModel");
const router = express.Router();

// @desc    Get all tasks
// @route   GET /api/tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Create a new task
// @route   POST /api/tasks
router.post("/", async (req, res) => {
  const { name, description, status, assignDate, lastDate } = req.body;

  if (!name || !description || !assignDate || !lastDate) {
    return res.status(400).json({ message: "Please fill in all fields." });
  }

  try {
    const newTask = new Task({
      name,
      description,
      status,
      assignDate,
      lastDate,
    });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found." });
    }
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }
    res.json({ message: "Task removed." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
