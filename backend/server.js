import express from "express";
import { existsSync, readFileSync, writeFileSync } from "fs";
import cors from "cors";
import bodyParser from "body-parser";
// const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const LOG_FILE = "performance_logs.json";

// Save performance data
app.post("/log-performance", (req, res) => {
  const data = req.body;

  // Read existing logs
  let logs = [];
  if (existsSync(LOG_FILE)) {
    logs = JSON.parse(readFileSync(LOG_FILE, "utf8"));
  }

  logs.push(data);
  writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));

  res.json({ message: "Performance logged successfully!" });
});

// Get stored data
app.get("/get-performance-data", (req, res) => {
  if (!existsSync(LOG_FILE)) {
    return res.json([]);
  }
  res.json(JSON.parse(readFileSync(LOG_FILE, "utf8")));
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
