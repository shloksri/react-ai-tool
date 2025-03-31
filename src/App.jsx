import React, { useState, Profiler, useMemo, useEffect } from "react";

// Expensive Fibonacci calculation (inefficient recursive)
const expensiveFibonacci = (num) => {
  if (num <= 1) return num;
  return expensiveFibonacci(num - 1) + expensiveFibonacci(num - 2);
};

const fetchData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve("API Data Loaded"), 3000); // Simulate 3 sec delay
  });
};

// Simulating heavy computation
const expensiveComputation = (num) => {
  let result = 0;
  for (let i = 0; i < num; i++) {
    result += Math.sqrt(i);
  }
  return result;
};

// Performance logging function
const onRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) => {
  const performanceData = {
    component: id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    renderTime: actualDuration,
    stateUpdates: 1, // We update state only once per click
    propsReceived: 1, // Each component receives only one prop
    propsUsed: 1, // Each component uses all its received props
    optimizationApplied: id === "FastComponent" ? "memoization" : "none",
  };

  console.log("Performance Data:", performanceData);

  // Send performance data to backend for training
  fetch("http://localhost:5001/log-performance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(performanceData),
  }).catch((err) => console.error("Error sending performance data:", err));
};

// Optimized component
const FastComponent = React.memo(({ count }) => {
  console.log("FastComponent rendered");
  return (
    <Profiler
      id="FastComponent"
      onRender={onRenderCallback}>
      <div>
        Fast Component <br />
        State variable - count: {count}
      </div>
    </Profiler>
  );
});

// Unoptimized component
const ExpensiveComponent = ({ otherCount }) => {
  console.log("ExpensiveComponent rendered");

  // Doing expensive computation inside render
  const computedValue = expensiveComputation(100000000);

  return (
    <Profiler
      id="ExpensiveComponent"
      onRender={onRenderCallback}>
      <div>
        <strong>Expensive Component</strong> <br />
        Computed Value: {computedValue} <br />
        State variable - otherCount: {otherCount}
      </div>
    </Profiler>
  );
};

const App = () => {
  const [count, setCount] = useState(0);
  const [otherCount, setOtherCount] = useState(0);

  return (
    <div>
      <h1>React Performance Monitoring</h1>
      <FastComponent count={count} />
      <br />
      <ExpensiveComponent otherCount={otherCount} />
      <br />
      <button onClick={() => setCount((prev) => prev + 1)}>Count +</button>
      <button onClick={() => setOtherCount((prev) => prev + 1)}>
        Other Count +
      </button>
    </div>
  );
};

export default App;
