import React, { useState, useEffect, Profiler } from "react";

// Function to log performance data
const onRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime,
  interactions
) => {
  const renderTime = actualDuration; // For example, render time can be actualDuration
  const stateUpdates = 1; // Replace with logic to count state updates
  const propsReceived = 3; // Example: Track number of props received (adjust as needed)
  const propsUsed = 2; // Example: Track number of props used in the render
  const optimizationApplied = "none";

  const performanceData = {
    component: id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    optimizationApplied,
    renderTime, // Add renderTime
    stateUpdates, // Add stateUpdates
    propsReceived, // Add propsReceived
    propsUsed, // Add propsUsed
  };
  console.log("Performance Data:", performanceData);

  // Send to backend for training
  fetch("http://localhost:5001/log-performance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(performanceData),
  }).catch((err) => console.error("Error sending performance data:", err));
};

const ExpensiveComponent = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Profiler
      id="ExpensiveComponent"
      onRender={onRenderCallback}>
      <div>
        <h2>Expensive Component</h2>
        <p>Count: {count}</p>
      </div>
    </Profiler>
  );
};

const App = () => {
  return (
    <div>
      <h1>React Performance Monitoring</h1>
      <ExpensiveComponent />
    </div>
  );
};

export default App;
