import pandas as pd
from sklearn.tree import DecisionTreeClassifier
import joblib
import json

# Load Data
with open("performance_logs.json", "r") as file:
    logs = json.load(file)

# Convert JSON to DataFrame
df = pd.DataFrame(logs)

# Convert categorical labels (optimizationApplied) to numerical values
df["optimizationApplied"] = df["optimizationApplied"].astype("category").cat.codes

# Feature Selection
X = df[["renderTime", "stateUpdates", "propsReceived", "propsUsed"]]
y = df["optimizationApplied"]

# Train Model
model = DecisionTreeClassifier()
model.fit(X, y)

# Save Model
joblib.dump(model, "react_perf_model.pkl")

print("🎯 Model trained and saved as react_perf_model.pkl")
