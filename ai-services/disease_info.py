from __future__ import annotations


def build_disease_info(name, pesticide, dosage, frequency, prevention):
    return {
        "name": name,
        "pesticide": pesticide,
        "dosage": dosage,
        "frequency": frequency,
        "prevention": prevention,
    }


HEALTHY_DISEASE_INFO = build_disease_info(
    "Healthy",
    "None",
    "N/A",
    "N/A",
    [
        "Maintain proper watering and nutrition.",
        "Ensure good sunlight and airflow.",
        "Continue regular crop monitoring.",
    ],
)

DEFAULT_DISEASE_INFO = build_disease_info(
    "Unknown Disease",
    "Consult local agricultural expert",
    "Use according to product label",
    "Follow crop-specific advisory",
    [
        "Remove severely infected leaves or branches.",
        "Avoid overhead irrigation when possible.",
        "Keep tools and field surfaces clean.",
    ],
)

disease_info = {
    "Apple___Apple_scab": build_disease_info(
        "Apple Scab",
        "Captan",
        "2 g per liter of water",
        "Every 7 to 10 days",
        [
            "Collect and destroy fallen infected leaves.",
            "Prune trees to improve air circulation.",
            "Avoid overhead irrigation.",
        ],
    ),
    "Apple___Black_rot": build_disease_info(
        "Apple Black Rot",
        "Mancozeb",
        "2.5 g per liter of water",
        "Every 7 days",
        [
            "Remove infected leaves and mummified fruits.",
            "Avoid overhead irrigation.",
            "Ensure good air circulation in the orchard.",
        ],
    ),
    "Apple___Cedar_apple_rust": build_disease_info(
        "Apple Cedar Rust",
        "Myclobutanil",
        "1 ml per liter of water",
        "Every 10 days",
        [
            "Remove nearby alternate host plants if possible.",
            "Prune infected twigs early.",
            "Maintain balanced fertilization.",
        ],
    ),
    "Apple___healthy": HEALTHY_DISEASE_INFO,
    "Cherry_(including_sour)___Powdery_mildew": build_disease_info(
        "Cherry Powdery Mildew",
        "Wettable Sulfur",
        "2 g per liter of water",
        "Every 7 days",
        [
            "Prune dense canopy to reduce humidity.",
            "Avoid excessive nitrogen fertilizer.",
            "Remove infected leaves early.",
        ],
    ),
    "Corn_(maize)___Common_rust_": build_disease_info(
        "Corn Common Rust",
        "Propiconazole",
        "1 ml per liter of water",
        "Every 10 days",
        [
            "Use rust-tolerant hybrids where available.",
            "Monitor the crop from early growth stages.",
            "Avoid excessive late-evening irrigation.",
        ],
    ),
    "Grape___Black_rot": build_disease_info(
        "Grape Black Rot",
        "Mancozeb",
        "2 g per liter of water",
        "Every 7 days",
        [
            "Remove infected berries and leaves.",
            "Improve vine airflow through pruning.",
            "Keep vineyard floor free from plant debris.",
        ],
    ),
    "Orange___Haunglongbing_(Citrus_greening)": build_disease_info(
        "Citrus Greening",
        "Imidacloprid",
        "0.3 ml per liter of water",
        "Based on psyllid monitoring",
        [
            "Control citrus psyllid populations.",
            "Use disease-free planting material.",
            "Remove severely infected trees if needed.",
        ],
    ),
    "Potato___Early_blight": build_disease_info(
        "Potato Early Blight",
        "Chlorothalonil",
        "2 g per liter of water",
        "Every 7 days",
        [
            "Remove older infected leaves early.",
            "Maintain balanced nitrogen supply.",
            "Practice crop rotation.",
        ],
    ),
    "Potato___Late_blight": build_disease_info(
        "Potato Late Blight",
        "Mancozeb",
        "2.5 g per liter of water",
        "Every 5 to 7 days",
        [
            "Destroy infected plants immediately.",
            "Avoid prolonged leaf wetness.",
            "Use certified disease-free seed tubers.",
        ],
    ),
    "Tomato___Bacterial_spot": build_disease_info(
        "Tomato Bacterial Spot",
        "Copper Oxychloride",
        "2.5 g per liter of water",
        "Every 7 days",
        [
            "Use certified disease-free seedlings.",
            "Avoid handling wet plants.",
            "Remove infected lower leaves promptly.",
        ],
    ),
    "Tomato___Early_blight": build_disease_info(
        "Tomato Early Blight",
        "Chlorothalonil",
        "2 g per liter of water",
        "Every 7 days",
        [
            "Use mulch to reduce soil splash.",
            "Stake plants for better airflow.",
            "Remove infected leaves regularly.",
        ],
    ),
    "Tomato___Late_blight": build_disease_info(
        "Tomato Late Blight",
        "Mancozeb",
        "2 g per liter of water",
        "Every 7 days",
        [
            "Destroy infected foliage promptly.",
            "Avoid overhead irrigation.",
            "Monitor weather during cool and humid periods.",
        ],
    ),
    "Tomato___Leaf_Mold": build_disease_info(
        "Tomato Leaf Mold",
        "Copper Oxychloride",
        "2 g per liter of water",
        "Every 7 to 10 days",
        [
            "Reduce humidity around plants.",
            "Improve greenhouse or field ventilation.",
            "Remove lower infected leaves.",
        ],
    ),
    "Tomato___Septoria_leaf_spot": build_disease_info(
        "Tomato Septoria Leaf Spot",
        "Mancozeb",
        "2 g per liter of water",
        "Every 7 days",
        [
            "Remove infected leaves from the lower canopy.",
            "Use mulch to reduce soil splash.",
            "Rotate away from tomato and related crops.",
        ],
    ),
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": build_disease_info(
        "Tomato Yellow Leaf Curl Virus",
        "Imidacloprid",
        "0.3 ml per liter of water",
        "Based on whitefly pressure",
        [
            "Control whitefly populations.",
            "Remove infected plants early.",
            "Use virus-tolerant varieties where available.",
        ],
    ),
    "Tomato___Tomato_mosaic_virus": build_disease_info(
        "Tomato Mosaic Virus",
        "None",
        "N/A",
        "Focus on sanitation",
        [
            "Remove infected plants immediately.",
            "Disinfect hands and tools after handling plants.",
            "Use virus-free seed and seedlings.",
        ],
    ),
}


def get_disease_info(disease_key):
    if disease_key in disease_info:
        return disease_info[disease_key]

    if disease_key.endswith("___healthy"):
        return HEALTHY_DISEASE_INFO

    return DEFAULT_DISEASE_INFO


def get_treatment_details(disease_key):
    info = get_disease_info(disease_key)
    return {
        "pesticide": info["pesticide"],
        "dosage": info["dosage"],
        "frequency": info["frequency"],
        "prevention": info["prevention"],
    }
