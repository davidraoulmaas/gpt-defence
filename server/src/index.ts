import "dotenv/config";
import express from "express";
import cors from "cors";
import { generateTowerRouter } from "./routes/generateTower";
import { generateWaveRouter } from "./routes/generateWave";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Game routes
app.use("/generate-tower", generateTowerRouter);
app.use("/generate-wave", generateWaveRouter);

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`[server] Listening on http://localhost:${PORT}`);
  console.log(`[server] LLM provider: ${process.env.LLM_PROVIDER ?? "mock"}`);
});
