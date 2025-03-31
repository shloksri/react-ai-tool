import sys
import joblib
import json
import numpy as np
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

# Reshape and normalize input using the same scaler used in training
input_features = np.array(input_features).reshape(1, -1)
input_features = scaler.transform(input_features)

# Predict optimization technique
prediction = model.predict(input_features)[0]

# Convert numerical prediction back to label
predicted_label = label_encoder.inverse_transform([prediction])[0]

# Output the prediction result
print(predicted_label)
