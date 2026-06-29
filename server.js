const express = require("express");
const connectDB = require("./config/db");
const bookRoutes = require("./routes/bookRoutes");
require("dotenv").config();
const cors = require("cors");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173"
}));

// Routes - this must use bookRoutes (the router)
app.use("/api/books", bookRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Book Library API is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});