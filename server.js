// Import required packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

// Initialize the Express app
const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable Cross-Origin Resource Sharing

// MongoDB Connection
const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection string from .env
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process with failure
  }
};

// Call the connection function
connectDB();

// Task Schema and Model using Mongoose
const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: "Not Completed" },
  assignDate: { type: Date, default: Date.now },
  lastDate: { type: Date, required: true },
});

// Create the Task model
const Task = mongoose.model("Task", taskSchema);

// API Routes

// 1. Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// 2. Add a new task
app.post("/api/tasks", async (req, res) => {
  try {
    const { name, description, lastDate } = req.body;
    const task = new Task({
      name,
      description,
      lastDate,
    });
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: "Failed to add task" });
  }
});

// 3. Update a task
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const { name, description, status, lastDate } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { name, description, status, lastDate },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: "Failed to update task" });
  }
});

// 4. Delete a task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete task" });
  }
});

// Home route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Server listening on port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
