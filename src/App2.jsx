import React, { useState } from "react";

// FastComponent is wrapped with React.memo to prevent unnecessary re-renders
const FastComponent = React.memo(({ count }) => {
  console.log("FastComponent rendered");
  return (
    <div>
      Fast Component <br />
      Count: {count}
    </div>
  );
});

const ExpensiveComponent = ({ otherCount }) => {
  console.log("ExpensiveComponent rendered");
  return (
    <div>
      Expensive Component <br />
      Count: {otherCount}
    </div>
  );
};

function App2() {
  const [count, setCount] = useState(0);
  const [otherCount, setOtherCount] = useState(0);

  return (
    <div>
      <h1>React.memo Example</h1>
      <FastComponent count={count} />
      <br />
      <ExpensiveComponent otherCount={otherCount} />
      <br />
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
      <button onClick={() => setOtherCount(otherCount + 1)}>
        Change Other Count
      </button>
    </div>
  );
}

export default App2;
