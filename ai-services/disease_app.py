from __future__ import annotations

import os

from flask import Flask, jsonify, request
from PIL import UnidentifiedImageError

from predict import predict_uploaded_file
from utils.disease_info import disease_info


app = Flask(__name__)


@app.route("/predict", methods=["POST"])
def predict():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        uploaded_file = request.files["file"]
        if not uploaded_file or not uploaded_file.filename:
            return jsonify({"error": "No file uploaded"}), 400

        result = predict_uploaded_file(uploaded_file)
        predicted_class = result.get("disease_key", "")
        confidence = result.get("confidence", 0)

        info = disease_info.get(
            predicted_class,
            {
                "name": predicted_class or "Unknown Disease",
                "pesticide": "Consult expert",
                "dosage": "N/A",
                "frequency": "N/A",
                "prevention": ["Consult expert"],
            },
        )

        response = {
            "disease": info["name"],
            "confidence": confidence,
            "treatment": {
                "pesticide": info["pesticide"],
                "dosage": info["dosage"],
                "frequency": info["frequency"],
            },
            "prevention": info["prevention"],
        }

        return jsonify(response), 200
    except UnidentifiedImageError:
        return jsonify({"error": "Invalid image file"}), 400
    except OSError:
        return jsonify({"error": "Invalid image file"}), 400
    except FileNotFoundError as exc:
        return jsonify({"error": str(exc)}), 500
    except Exception as exc:
        return jsonify({"error": f"Prediction failed: {exc}"}), 500


if __name__ == "__main__":
    port = int(os.environ.get("FLASK_PORT", 5002))
    app.run(host="0.0.0.0", port=port, debug=True)
