import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import joblib
import json

# Load Data
with open("performance_logs.json", "r") as file:
    logs = json.load(file)

# Convert JSON to DataFrame
df = pd.DataFrame(logs)

# Check available labels
print("🔍 Available optimizations:", df["optimizationApplied"].unique())

# Adjust `optimizationApplied` based on `actualDuration`
def adjust_labels(row):
    actual_duration = row["actualDuration"]

    # Classify fast renders as optimized
    if 0 <= actual_duration <= 0.05:
        return "optimized"
    
    # Keep the original optimization applied label otherwise
    return row["optimizationApplied"]

df["optimizationApplied"] = df.apply(adjust_labels, axis=1)

# Encode categorical labels
label_encoder = LabelEncoder()
df["optimizationApplied"] = label_encoder.fit_transform(df["optimizationApplied"])

# Feature Selection (Including actualDuration)
X = df[["actualDuration", "renderTime", "stateUpdates", "propsReceived", "propsUsed"]]
y = df["optimizationApplied"]

# Normalize Features
scaler = StandardScaler()
X = scaler.fit_transform(X)

# Split into Training and Testing Set (80% Train, 20% Test)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Model
model = DecisionTreeClassifier()
model.fit(X_train, y_train)

# Evaluate Model
y_pred = model.predict(X_test)
print("✅ Model Accuracy:", accuracy_score(y_test, y_pred))
print("📊 Classification Report:\n", classification_report(y_test, y_pred))

# Save Model & Scaler
joblib.dump(model, "react_perf_model.pkl")
joblib.dump(scaler, "scaler.pkl")
joblib.dump(label_encoder, "label_encoder.pkl")

print("🎯 Model trained and saved as react_perf_model.pkl")
