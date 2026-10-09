import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { apiRouter } from "./routes/api.router";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/v1", apiRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    name: "Sahyog (सहयोग) Cooperative Gig Services Platform REST API",
    status: "online",
    documentation: "/api/v1/health",
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: "API Route not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 Sahyog Backend REST API running on http://localhost:${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/v1/health`);
});
