#!/usr/bin/env node

import inquirer from "inquirer";
import path from "path";
import { readFileSync } from "fs";
import { PythonShell } from "python-shell";

const predictScriptPath = path.resolve("ai_model/predict.py");

// Load performance logs
const logsPath = path.resolve("backend/performance_logs.json");
const logs = JSON.parse(readFileSync(logsPath, "utf8"));

// Extract unique component names
const uniqueComponents = [...new Set(logs.map((log) => log.component))];

// Select a Component for Analysis
async function analyzePerformance() {
  if (uniqueComponents.length === 0) {
    console.log("❌ No performance logs found.");
    return;
  }

  const { componentName } = await inquirer.prompt([
    {
      type: "list",
      name: "componentName",
      message: "Select a component to analyze:",
      choices: uniqueComponents,
    },
  ]);

  // Find the latest log entry for the selected component
  const componentData = logs
    .filter((log) => log.component === componentName)
    .pop(); // Take the last occurrence

  if (!componentData) {
    console.log(`❌ No data found for ${componentName}`);
    return;
  }

  const inputFeatures = [
    componentData.actualDuration, // actualDuration
    componentData.renderTime, // renderTime
    componentData.stateUpdates, // stateUpdates
    componentData.propsReceived, // propsReceived
    componentData.propsUsed || -1, // propsUsed (use -1 if undefined)
  ];

  console.log("🚀 Running AI model prediction...");

  // Run Python script
  const shell = new PythonShell(predictScriptPath, {
    args: [JSON.stringify(inputFeatures)],
  });

  shell.on("message", (message) => {
    console.log(`\n🔍 AI Suggestion for ${componentName}:`);
    console.log(`💡 Apply: ${message.trim()}\n`);
  });

  shell.on("stderr", (stderr) => {
    console.error("🐍 Python Error:", stderr);
  });

  shell.end((err) => {
    if (err) {
      console.error("❌ Error running prediction:", err);
    }
  });
}

analyzePerformance();
