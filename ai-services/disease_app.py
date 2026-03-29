from __future__ import annotations

import os

from flask import Flask, jsonify, request
from PIL import UnidentifiedImageError

from predict import predict_uploaded_file


app = Flask(__name__)


def build_treatment(pesticide, dosage, frequency, prevention):
    return {
        "pesticide": pesticide,
        "dosage": dosage,
        "frequency": frequency,
        "prevention": prevention,
    }


HEALTHY_TREATMENT = build_treatment(
    "Not required",
    "Monitor plant health only",
    "No spray needed",
    [
        "Continue regular field scouting.",
        "Maintain balanced irrigation and nutrition.",
        "Use certified seeds and clean tools.",
    ],
)

DEFAULT_TREATMENT = build_treatment(
    "Consult local expert",
    "Use as per label recommendation",
    "Follow crop-specific advisory",
    [
        "Remove severely infected plant parts.",
        "Avoid water splash on foliage.",
        "Maintain field sanitation and crop rotation.",
    ],
)

disease_info = {
    "Apple___Apple_scab": build_treatment(
        "Captan",
        "2 g per liter",
        "Every 7 to 10 days",
        [
            "Collect and destroy fallen infected leaves.",
            "Prune trees for better airflow.",
            "Avoid overhead irrigation.",
        ],
    ),
    "Apple___Black_rot": build_treatment(
        "Mancozeb",
        "2.5 g per liter",
        "Every 7 days",
        [
            "Remove mummified fruits and cankers.",
            "Disinfect pruning tools regularly.",
            "Keep orchard floor clean.",
        ],
    ),
    "Apple___Cedar_apple_rust": build_treatment(
        "Myclobutanil",
        "1 ml per liter",
        "Every 10 days",
        [
            "Remove nearby alternate host plants where possible.",
            "Prune infected twigs early.",
            "Ensure balanced fertilizer application.",
        ],
    ),
    "Blueberry___healthy": HEALTHY_TREATMENT,
    "Cherry_(including_sour)___Powdery_mildew": build_treatment(
        "Wettable sulfur",
        "2 g per liter",
        "Every 7 days",
        [
            "Prune dense canopy to reduce humidity.",
            "Avoid excessive nitrogen fertilizer.",
            "Remove infected leaves early.",
        ],
    ),
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": build_treatment(
        "Azoxystrobin",
        "1 ml per liter",
        "Every 10 to 14 days",
        [
            "Use resistant hybrids where available.",
            "Rotate with non-host crops.",
            "Manage crop residue after harvest.",
        ],
    ),
    "Corn_(maize)___Common_rust_": build_treatment(
        "Propiconazole",
        "1 ml per liter",
        "Every 10 days",
        [
            "Plant rust-tolerant varieties.",
            "Monitor crop from early growth stage.",
            "Avoid excessive irrigation late in the day.",
        ],
    ),
    "Corn_(maize)___Northern_Leaf_Blight": build_treatment(
        "Mancozeb",
        "2.5 g per liter",
        "Every 7 to 10 days",
        [
            "Rotate crops after maize season.",
            "Remove infected residue from the field.",
            "Maintain balanced plant nutrition.",
        ],
    ),
    "Grape___Black_rot": build_treatment(
        "Mancozeb",
        "2 g per liter",
        "Every 7 days",
        [
            "Remove infected berries and leaves.",
            "Improve vine airflow through pruning.",
            "Keep vineyard floor free of plant debris.",
        ],
    ),
    "Grape___Esca_(Black_Measles)": build_treatment(
        "Carbendazim",
        "1 g per liter",
        "As advised after pruning",
        [
            "Prune infected wood during dry weather.",
            "Seal pruning wounds after cutting.",
            "Avoid water stress in vines.",
        ],
    ),
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": build_treatment(
        "Copper oxychloride",
        "2.5 g per liter",
        "Every 7 to 10 days",
        [
            "Remove badly infected leaves.",
            "Avoid overcrowded vine canopy.",
            "Monitor leaf wetness during irrigation.",
        ],
    ),
    "Orange___Haunglongbing_(Citrus_greening)": build_treatment(
        "Imidacloprid for vector control",
        "0.3 ml per liter",
        "As per psyllid monitoring",
        [
            "Remove infected trees if severely affected.",
            "Control citrus psyllid populations.",
            "Use disease-free planting material.",
        ],
    ),
    "Peach___Bacterial_spot": build_treatment(
        "Copper hydroxide",
        "2 g per liter",
        "Every 7 days",
        [
            "Avoid overhead irrigation.",
            "Prune for airflow and faster drying.",
            "Use tolerant cultivars if available.",
        ],
    ),
    "Pepper,_bell___Bacterial_spot": build_treatment(
        "Copper oxychloride",
        "2.5 g per liter",
        "Every 7 days",
        [
            "Use clean seed and transplants.",
            "Avoid handling wet plants.",
            "Remove infected debris from the field.",
        ],
    ),
    "Potato___Early_blight": build_treatment(
        "Chlorothalonil",
        "2 g per liter",
        "Every 7 days",
        [
            "Remove older infected leaves early.",
            "Maintain balanced nitrogen supply.",
            "Practice crop rotation.",
        ],
    ),
    "Potato___Late_blight": build_treatment(
        "Mancozeb",
        "2.5 g per liter",
        "Every 5 to 7 days",
        [
            "Destroy infected plants immediately.",
            "Avoid prolonged leaf wetness.",
            "Use certified disease-free seed tubers.",
        ],
    ),
    "Squash___Powdery_mildew": build_treatment(
        "Wettable sulfur",
        "2 g per liter",
        "Every 7 days",
        [
            "Improve spacing between plants.",
            "Remove infected leaves early.",
            "Avoid excess nitrogen application.",
        ],
    ),
    "Strawberry___Leaf_scorch": build_treatment(
        "Copper fungicide",
        "2 g per liter",
        "Every 7 to 10 days",
        [
            "Remove diseased leaves after harvest.",
            "Avoid sprinkler irrigation where possible.",
            "Ensure good field sanitation.",
        ],
    ),
    "Tomato___Bacterial_spot": build_treatment(
        "Copper oxychloride",
        "2.5 g per liter",
        "Every 7 days",
        [
            "Avoid working in wet fields.",
            "Use certified disease-free seedlings.",
            "Remove infected lower leaves.",
        ],
    ),
    "Tomato___Early_blight": build_treatment(
        "Chlorothalonil",
        "2 g per liter",
        "Every 7 days",
        [
            "Mulch soil to reduce splash spread.",
            "Stake plants for better airflow.",
            "Remove infected leaves regularly.",
        ],
    ),
    "Tomato___Late_blight": build_treatment(
        "Mancozeb",
        "2 g per liter",
        "Every 7 days",
        [
            "Destroy infected foliage promptly.",
            "Avoid overhead irrigation.",
            "Monitor weather during cool, humid periods.",
        ],
    ),
    "Tomato___Leaf_Mold": build_treatment(
        "Copper oxychloride",
        "2 g per liter",
        "Every 7 to 10 days",
        [
            "Reduce greenhouse humidity if protected cultivation is used.",
            "Improve ventilation around plants.",
            "Remove lower infected leaves.",
        ],
    ),
    "Tomato___Septoria_leaf_spot": build_treatment(
        "Mancozeb",
        "2 g per liter",
        "Every 7 days",
        [
            "Remove infected leaves from lower canopy.",
            "Use mulch to reduce soil splash.",
            "Rotate away from tomato and related crops.",
        ],
    ),
    "Tomato___Spider_mites Two-spotted_spider_mite": build_treatment(
        "Abamectin",
        "0.5 ml per liter",
        "Every 5 to 7 days",
        [
            "Spray underside of leaves thoroughly.",
            "Reduce dust around crop rows.",
            "Avoid unnecessary broad-spectrum insecticides.",
        ],
    ),
    "Tomato___Target_Spot": build_treatment(
        "Azoxystrobin",
        "1 ml per liter",
        "Every 7 to 10 days",
        [
            "Avoid long periods of leaf wetness.",
            "Prune for airflow and light penetration.",
            "Remove infected crop debris after harvest.",
        ],
    ),
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": build_treatment(
        "Imidacloprid for whitefly control",
        "0.3 ml per liter",
        "As per vector pressure",
        [
            "Remove infected plants early.",
            "Control whitefly populations.",
            "Use virus-tolerant varieties where available.",
        ],
    ),
    "Tomato___Tomato_mosaic_virus": build_treatment(
        "No curative pesticide available",
        "Not applicable",
        "Focus on sanitation",
        [
            "Remove infected plants immediately.",
            "Disinfect hands and tools after handling plants.",
            "Use virus-free seed and seedlings.",
        ],
    ),
}


def get_treatment_details(disease_key):
    if disease_key in disease_info:
        return disease_info[disease_key]

    if disease_key.endswith("___healthy"):
        return HEALTHY_TREATMENT

    return DEFAULT_TREATMENT


@app.route("/predict", methods=["POST"])
def predict():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        uploaded_file = request.files["file"]
        if not uploaded_file or not uploaded_file.filename:
            return jsonify({"error": "No file uploaded"}), 400

        result = predict_uploaded_file(uploaded_file)
        disease_key = result.pop("disease_key", "")
        result["treatment"] = get_treatment_details(disease_key)
        return jsonify(result), 200
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
