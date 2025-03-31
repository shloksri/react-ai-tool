import sys
import joblib
import json
import numpy as np
import pandas as pd
import os

# Define file paths
model_path = "ai_model/react_perf_model.pkl"
scaler_path = "ai_model/scaler.pkl"
label_encoder_path = "ai_model/label_encoder.pkl"

# Check if files exist before loading
for path in [model_path, scaler_path, label_encoder_path]:
    if not os.path.exists(path):
        print(f"❌ Error: Missing file {path}. Run `python ai_model/train_model.py` to generate it.")
        sys.exit(1)

# Load trained model, scaler, and label encoder
model = joblib.load(model_path)
scaler = joblib.load(scaler_path)
label_encoder = joblib.load(label_encoder_path)

# Load input features from CLI argument
input_features = json.loads(sys.argv[1])

# Check if the input is a list (array of values)
if isinstance(input_features, list):
    # If it's a list, we need to convert it into a dictionary with expected keys
    expected_features = ["actualDuration", "renderTime", "stateUpdates", "propsReceived", "propsUsed"]
    if len(input_features) != len(expected_features):
        print(f"❌ Error: Input feature length mismatch. Expected {len(expected_features)} values.")
        sys.exit(1)
    input_features = dict(zip(expected_features, input_features))

# Ensure all required features are present (fill missing ones with -1)
for feature in expected_features:
    if feature not in input_features:
        input_features[feature] = -1  # Placeholder if unknown

# Convert input to DataFrame (ensures correct order)
input_df = pd.DataFrame([input_features], columns=expected_features)

# Normalize input using the trained scaler
input_scaled = scaler.transform(input_df)

# Predict optimization technique
prediction = model.predict(input_scaled)[0]

# Convert numerical prediction back to label
predicted_label = label_encoder.inverse_transform([prediction])[0]

# Output the prediction result
print(predicted_label)
