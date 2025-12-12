require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const quizRoutes = require("./routes/quizRoutes");
const attemptRoutes = require("./routes/attemptRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/quiz", quizRoutes);
app.use("/attempt", attemptRoutes);

const PORT = 5000;

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
