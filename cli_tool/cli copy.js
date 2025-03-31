#!/usr/bin/env node

import inquirer from "inquirer";
import path from "path";
import { readFileSync } from "fs";
import { PythonShell } from "python-shell";

const predictScriptPath = path.resolve("ai_model/predict.py");

// import * from "../backend/performance_logs.json"
const { prompt } = inquirer;
// Load Logs
const logsPath = path.resolve("backend/performance_logs.json");
const logs = JSON.parse(readFileSync(logsPath, "utf8"));

// Select a Component for Analysis
async function analyzePerformance() {
  const { componentName } = await prompt([
    {
      type: "list",
      name: "componentName",
      message: "Select a component to analyze:",
      choices: logs.map((log) => log.component),
    },
  ]);

  const componentData = logs.find((log) => log.component === componentName);
  const inputFeatures = [
    componentData.renderTime,
    componentData.stateUpdates,
    componentData.propsReceived,
    componentData.propsUsed,
  ];

  // Run Python script to predict optimization
  const options = {
    args: [JSON.stringify(inputFeatures)], // Pass input data as argument
  };

  PythonShell.run(predictScriptPath, options, (err, results) => {
    if (err) {
      console.error("Error running prediction:", err);
    } else {
      const predictedOptimization = results[0];
      console.log(`\n🔍 AI Suggestion for ${componentName}:`);
      console.log(`💡 Apply: ${predictedOptimization}\n`);
    }
  });
}

analyzePerformance();
