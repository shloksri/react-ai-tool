import React, { useState, useEffect, Profiler, memo, useCallback } from "react";

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
  const renderTime = actualDuration;
  const stateUpdates = 1;
  const propsReceived = 1;
  const propsUsed = 1;
  const optimizationApplied = phase === "update" ? "React.memo" : "none";

  const performanceData = {
    component: id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    optimizationApplied,
    renderTime,
    stateUpdates,
    propsReceived,
    propsUsed,
  };

  console.log("Performance Data:", performanceData);

  fetch("http://localhost:5001/log-performance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(performanceData),
  }).catch((err) => console.error("Error sending performance data:", err));
};

// Optimized Component using React.memo
const ExpensiveComponent = memo(({ count }) => {
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
});

const App = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>React Performance Monitoring</h1>
      <ExpensiveComponent count={count} />
    </div>
  );
};

export default App;
