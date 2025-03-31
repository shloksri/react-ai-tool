import React, { useState } from "react";

// ChildComponent is wrapped with React.memo to prevent unnecessary re-renders
const ChildComponent = React.memo(({ count }) => {
  console.log("ChildComponent rendered");
  return <div>Count: {count}</div>;
});

const OtherComponent = ({ otherCount }) => {
  console.log("OtherComponent rendered");
  return <div>Other Count: {otherCount}</div>;
};

function App2() {
  const [count, setCount] = useState(0);
  const [otherCount, setOtherCount] = useState(0);

  return (
    <div>
      <h1>React.memo Example</h1>
      <ChildComponent count={count} />
      <OtherComponent otherCount={otherCount} />
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
      <button onClick={() => setOtherCount(otherCount + 1)}>
        Change Other Count
      </button>
    </div>
  );
}

export default App2;
