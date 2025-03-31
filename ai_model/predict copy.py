import sys
import joblib
import json
import os

# Debugging: Print current working directory
print(f"📂 Current Working Directory: {os.getcwd()}", file=sys.stderr)

# Define model path
model_path = os.path.join(os.path.dirname(__file__), "react_perf_model.pkl")

# Check if model file exists
if not os.path.exists(model_path):
    print(f"❌ Error: Model file not found at {model_path}", file=sys.stderr)
    sys.exit(1)

# Load the model
try:
    model = joblib.load(model_path)
    print("✅ Model loaded successfully.", file=sys.stderr)
except Exception as e:
    print(f"❌ Error loading model: {str(e)}", file=sys.stderr)
    sys.exit(1)

# Load input features
try:
    input_features = json.loads(sys.argv[1])
    print(f"🔹 Input Features: {input_features}", file=sys.stderr)
except Exception as e:
    print(f"❌ Error parsing input data: {str(e)}", file=sys.stderr)
    sys.exit(1)

# Predict optimization
try:
    prediction = model.predict([input_features])[0]
    print(prediction)  # 🔥 Ensure the prediction is printed
    sys.stdout.flush()  # Force output immediately
except Exception as e:
    print(f"❌ Error during prediction: {str(e)}", file=sys.stderr)
    sys.exit(1)
