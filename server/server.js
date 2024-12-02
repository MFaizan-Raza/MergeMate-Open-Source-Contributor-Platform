import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import githubRoutes from "./routes/githubRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import reqProjectRoutes from "./routes/reqProjectRoutes.js";
import accTodosRoutes from "./routes/acceptRoutes.js";
dotenv.config();

const app = express();

connectDB();

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Routes
app.use("/", githubRoutes);
app.use("/api", projectRoutes);
app.use("/req", reqProjectRoutes);
app.use("/acc", accTodosRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on http://localhost:5000`);
});
