from pathlib import Path

import joblib
import numpy as np
from flask import Flask, jsonify, request
import os
from PIL import UnidentifiedImageError

from ocr_utils import extract_text_from_uploaded_file, infer_season_from_rainfall, parse_soil_report_text


BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "model"

MODEL_PATH = MODEL_DIR / "crop_model.joblib"
ENCODERS_BUNDLE_PATH = MODEL_DIR / "encoders.joblib"
LOCATION_ENCODER_PATH = MODEL_DIR / "location_encoder.joblib"
SEASON_ENCODER_PATH = MODEL_DIR / "season_encoder.joblib"
SOIL_ENCODER_PATH = MODEL_DIR / "soil_encoder.joblib"
LABEL_ENCODER_PATH = MODEL_DIR / "label_encoder.joblib"

REQUIRED_FIELDS = [
    "N",
    "P",
    "K",
    "temperature",
    "humidity",
    "ph",
    "rainfall",
    "location",
    "season",
    "soil",
]

NUMERIC_FIELDS = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
NUMERIC_FIELD_RULES = {
    "N": {"min": 0, "max": 140, "label": "Nitrogen (N)"},
    "P": {"min": 5, "max": 145, "label": "Phosphorus (P)"},
    "K": {"min": 5, "max": 205, "label": "Potassium (K)"},
    "temperature": {"min": 0, "max": 50, "label": "Temperature"},
    "humidity": {"min": 0, "max": 100, "label": "Humidity"},
    "ph": {"min": 0, "max": 14, "label": "pH"},
    "rainfall": {"min": 0, "max": 500, "label": "Rainfall"},
}
LOCATION_OPTIONS = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
]
SEASON_OPTIONS = ["Kharif", "Rabi", "Zaid"]
SOIL_OPTIONS = ["Loamy", "Clay", "Sandy"]
STATE_TO_MODEL_LOCATION = {
    "Andhra Pradesh": "Maharashtra",
    "Arunachal Pradesh": "Uttar Pradesh",
    "Assam": "Uttar Pradesh",
    "Bihar": "Uttar Pradesh",
    "Chhattisgarh": "Maharashtra",
    "Goa": "Gujarat",
    "Gujarat": "Gujarat",
    "Haryana": "Punjab",
    "Himachal Pradesh": "Punjab",
    "Jharkhand": "Uttar Pradesh",
    "Karnataka": "Maharashtra",
    "Kerala": "Maharashtra",
    "Madhya Pradesh": "Maharashtra",
    "Maharashtra": "Maharashtra",
    "Manipur": "Uttar Pradesh",
    "Meghalaya": "Uttar Pradesh",
    "Mizoram": "Uttar Pradesh",
    "Nagaland": "Uttar Pradesh",
    "Odisha": "Uttar Pradesh",
    "Punjab": "Punjab",
    "Rajasthan": "Gujarat",
    "Sikkim": "Uttar Pradesh",
    "Tamil Nadu": "Maharashtra",
    "Telangana": "Maharashtra",
    "Tripura": "Uttar Pradesh",
    "Uttar Pradesh": "Uttar Pradesh",
    "Uttarakhand": "Punjab",
    "West Bengal": "Uttar Pradesh",
}

app = Flask(__name__)


def load_encoder(name: str, path: Path):
    if path.exists():
        return joblib.load(path)

    if ENCODERS_BUNDLE_PATH.exists():
        encoders = joblib.load(ENCODERS_BUNDLE_PATH)
        if name in encoders:
            return encoders[name]

    raise FileNotFoundError(f"Missing encoder for '{name}'")


def load_artifacts():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")

    model = joblib.load(MODEL_PATH)
    encoders = {
        "location": load_encoder("location", LOCATION_ENCODER_PATH),
        "season": load_encoder("season", SEASON_ENCODER_PATH),
        "soil": load_encoder("soil", SOIL_ENCODER_PATH),
        "label": load_encoder("label", LABEL_ENCODER_PATH),
    }
    return model, encoders


MODEL, ENCODERS = load_artifacts()


def build_range_message(field_name: str) -> str:
    rule = NUMERIC_FIELD_RULES[field_name]
    if field_name == "temperature":
        return f"{rule['label']} must be between {rule['min']} and {rule['max']}C"
    return f"{rule['label']} must be between {rule['min']} and {rule['max']}"


def validate_payload(payload: dict) -> tuple[list[str], dict]:
    missing_fields = [field for field in REQUIRED_FIELDS if field not in payload]
    errors = {}

    for field_name, rule in NUMERIC_FIELD_RULES.items():
        raw_value = payload.get(field_name)
        if raw_value is None or str(raw_value).strip() == "":
            errors[field_name] = f"{rule['label']} is required"
            continue

        try:
            numeric_value = float(raw_value)
        except (TypeError, ValueError):
            errors[field_name] = f"{rule['label']} must be a numeric value"
            continue

        if numeric_value < rule["min"] or numeric_value > rule["max"]:
            errors[field_name] = build_range_message(field_name)

    location = str(payload.get("location", "")).strip()
    season = str(payload.get("season", "")).strip()
    soil = str(payload.get("soil", "")).strip()

    if not location:
        errors["location"] = "Location is required"
    elif location not in LOCATION_OPTIONS:
        errors["location"] = "Invalid location"

    if not season:
        errors["season"] = "Season is required"
    elif season not in SEASON_OPTIONS:
        errors["season"] = "Invalid season"

    if not soil:
        errors["soil"] = "Soil type is required"
    elif soil not in SOIL_OPTIONS:
        errors["soil"] = "Invalid soil type"

    return missing_fields, errors


def map_location_to_model_location(location: str) -> str:
    return STATE_TO_MODEL_LOCATION.get(location, location)


def encode_category(field_name: str, value: str) -> int:
    encoder = ENCODERS[field_name]

    if value not in encoder.classes_:
        valid_values = ", ".join(map(str, encoder.classes_))
        raise ValueError(f"Invalid {field_name}. Supported values: {valid_values}")

    return int(encoder.transform([value])[0])


def build_feature_array(payload: dict) -> np.ndarray:
    encoded_location = encode_category("location", map_location_to_model_location(str(payload["location"])))
    encoded_season = encode_category("season", str(payload["season"]))
    encoded_soil = encode_category("soil", str(payload["soil"]))

    features = [
        float(payload["N"]),
        float(payload["P"]),
        float(payload["K"]),
        float(payload["temperature"]),
        float(payload["humidity"]),
        float(payload["ph"]),
        float(payload["rainfall"]),
        encoded_location,
        encoded_season,
        encoded_soil,
    ]

    return np.array([features], dtype=float)


def get_top_recommendations(probabilities: np.ndarray) -> list[dict]:
    top_indices = np.argsort(probabilities)[-3:][::-1]
    top_labels = ENCODERS["label"].inverse_transform(top_indices)

    recommendations = []
    for crop_name, class_index in zip(top_labels, top_indices):
        recommendations.append(
            {
                "crop": str(crop_name),
                "confidence": round(float(probabilities[class_index]), 4),
            }
        )

    return recommendations


def generate_recommendations(payload: dict) -> list[dict]:
    input_array = build_feature_array(payload)
    probabilities = MODEL.predict_proba(input_array)[0]
    return get_top_recommendations(probabilities)


@app.route("/predict", methods=["POST"])
def predict():
    try:
        payload = request.get_json(silent=True)
        if not isinstance(payload, dict):
            return jsonify({"error": "Request body must be valid JSON"}), 400

        missing_fields, validation_errors = validate_payload(payload)
        if missing_fields:
            return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

        if validation_errors:
            return jsonify({"error": "Invalid input range", "details": validation_errors}), 400

        recommendations = generate_recommendations(payload)

        return jsonify({"recommendations": recommendations}), 200
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    except FileNotFoundError as exc:
        return jsonify({"error": str(exc)}), 500
    except Exception as exc:
        return jsonify({"error": f"Prediction failed: {exc}"}), 500


@app.route("/ocr-predict", methods=["POST"])
def ocr_predict():
    try:
        uploaded_file = request.files.get("file") or request.files.get("image")
        if not uploaded_file or not uploaded_file.filename:
            return jsonify({"error": "No file uploaded"}), 400

        extracted_text = extract_text_from_uploaded_file(uploaded_file)
        extracted_values, missing_fields = parse_soil_report_text(extracted_text)

        location = str(request.form.get("location") or "Gujarat").strip() or "Gujarat"
        season = str(request.form.get("season") or "").strip()
        if not season:
            season = infer_season_from_rainfall(extracted_values.get("rainfall"))
        soil = str(request.form.get("soil") or "Loamy").strip() or "Loamy"

        prediction_payload = {
            **extracted_values,
            "location": location,
            "season": season,
            "soil": soil,
        }

        recommendations = []
        prediction_errors = {}

        if not missing_fields:
            _, prediction_errors = validate_payload(prediction_payload)
            if not prediction_errors:
                recommendations = generate_recommendations(prediction_payload)

        return (
            jsonify(
                {
                    "extracted": extracted_values,
                    "missing_fields": missing_fields,
                    "recommendations": recommendations,
                    "context": {
                        "location": location,
                        "season": season,
                        "soil": soil,
                    },
                    "raw_text": extracted_text,
                    "prediction_errors": prediction_errors,
                }
            ),
            200,
        )
    except UnidentifiedImageError:
        return jsonify({"error": "Invalid image file"}), 400
    except RuntimeError as exc:
        return jsonify({"error": str(exc)}), 500
    except FileNotFoundError as exc:
        return jsonify({"error": str(exc)}), 500
    except Exception as exc:
        return jsonify({"error": f"OCR prediction failed: {exc}"}), 500


if __name__ == "__main__":
    port = int(os.environ.get("FLASK_PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
