const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/quizapp")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// IMPORT ROUTES
const quizRoutes = require("./routes/quizRoutes");
const attemptRoutes = require("./routes/attemptRoutes");

// USE ROUTES
app.use("/quiz", quizRoutes);
app.use("/attempt", attemptRoutes);

// ROOT ENDPOINT
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// START SERVER
app.listen(5000, () => console.log("Server running on port 5000"));
