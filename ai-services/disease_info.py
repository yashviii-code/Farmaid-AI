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
    "Blueberry___healthy": build_disease_info(
        "Blueberry Healthy",
        "None",
        "N/A",
        "N/A",
        [
            "Maintain proper irrigation and mulching.",
            "Ensure balanced soil acidity and nutrition.",
            "Keep monitoring plants for early stress signs.",
        ],
    ),
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
    "Cherry_(including_sour)___healthy": build_disease_info(
        "Cherry Healthy",
        "None",
        "N/A",
        "N/A",
        [
            "Prune regularly for sunlight and airflow.",
            "Keep irrigation consistent but not excessive.",
            "Monitor foliage during humid periods.",
        ],
    ),
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": build_disease_info(
        "Corn Cercospora Leaf Spot (Gray Leaf Spot)",
        "Azoxystrobin",
        "1 ml per liter of water",
        "Every 10 to 14 days",
        [
            "Use resistant hybrids when available.",
            "Rotate with non-host crops.",
            "Manage crop residue after harvest.",
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
    "Corn_(maize)___Northern_Leaf_Blight": build_disease_info(
        "Corn Northern Leaf Blight",
        "Mancozeb",
        "2.5 g per liter of water",
        "Every 7 to 10 days",
        [
            "Rotate crops after maize harvest.",
            "Remove infected residues from the field.",
            "Maintain balanced plant nutrition.",
        ],
    ),
    "Corn_(maize)___healthy": build_disease_info(
        "Corn Healthy",
        "None",
        "N/A",
        "N/A",
        [
            "Scout fields regularly for early disease symptoms.",
            "Maintain balanced fertilizer application.",
            "Avoid water stress during critical growth stages.",
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
    "Grape___Esca_(Black_Measles)": build_disease_info(
        "Grape Esca (Black Measles)",
        "Carbendazim",
        "1 g per liter of water",
        "As advised after pruning",
        [
            "Prune infected wood during dry weather.",
            "Seal pruning wounds after cutting.",
            "Avoid water stress in vines.",
        ],
    ),
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": build_disease_info(
        "Grape Leaf Blight (Isariopsis Leaf Spot)",
        "Copper Oxychloride",
        "2.5 g per liter of water",
        "Every 7 to 10 days",
        [
            "Remove badly infected leaves from the vine.",
            "Improve canopy airflow through pruning and spacing.",
            "Avoid prolonged leaf wetness during irrigation.",
        ],
    ),
    "Grape___healthy": HEALTHY_DISEASE_INFO,
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
    "Peach___Bacterial_spot": build_disease_info(
        "Peach Bacterial Spot",
        "Copper Hydroxide",
        "2 g per liter of water",
        "Every 7 days",
        [
            "Avoid overhead irrigation.",
            "Prune trees for airflow and quicker drying.",
            "Use tolerant varieties where available.",
        ],
    ),
    "Peach___healthy": build_disease_info(
        "Peach Healthy",
        "None",
        "N/A",
        "N/A",
        [
            "Maintain orchard sanitation.",
            "Ensure balanced nutrition and irrigation.",
            "Monitor leaves and fruits regularly.",
        ],
    ),
    "Pepper,_bell___Bacterial_spot": build_disease_info(
        "Bell Pepper Bacterial Spot",
        "Copper Oxychloride",
        "2.5 g per liter of water",
        "Every 7 days",
        [
            "Use clean seed and transplants.",
            "Avoid handling wet plants.",
            "Remove infected field debris promptly.",
        ],
    ),
    "Pepper,_bell___healthy": build_disease_info(
        "Bell Pepper Healthy",
        "None",
        "N/A",
        "N/A",
        [
            "Maintain good spacing between plants.",
            "Avoid irregular watering stress.",
            "Inspect lower leaves periodically.",
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
    "Potato___healthy": build_disease_info(
        "Potato Healthy",
        "None",
        "N/A",
        "N/A",
        [
            "Use certified seed tubers.",
            "Maintain balanced fertilization and irrigation.",
            "Hill up soil properly to protect tubers.",
        ],
    ),
    "Raspberry___healthy": build_disease_info(
        "Raspberry Healthy",
        "None",
        "N/A",
        "N/A",
        [
            "Prune canes regularly.",
            "Ensure proper spacing for airflow.",
            "Keep weed pressure low around plants.",
        ],
    ),
    "Soybean___healthy": build_disease_info(
        "Soybean Healthy",
        "None",
        "N/A",
        "N/A",
        [
            "Use high-quality treated seed.",
            "Rotate with other crops to reduce disease pressure.",
            "Scout fields during humid weather.",
        ],
    ),
    "Squash___Powdery_mildew": build_disease_info(
        "Squash Powdery Mildew",
        "Wettable Sulfur",
        "2 g per liter of water",
        "Every 7 days",
        [
            "Improve spacing between plants.",
            "Remove infected leaves early.",
            "Avoid excess nitrogen application.",
        ],
    ),
    "Strawberry___Leaf_scorch": build_disease_info(
        "Strawberry Leaf Scorch",
        "Copper Fungicide",
        "2 g per liter of water",
        "Every 7 to 10 days",
        [
            "Remove diseased leaves after harvest.",
            "Avoid sprinkler irrigation when possible.",
            "Keep beds clean and well ventilated.",
        ],
    ),
    "Strawberry___healthy": build_disease_info(
        "Strawberry Healthy",
        "None",
        "N/A",
        "N/A",
        [
            "Use clean mulch around plants.",
            "Avoid overcrowding and stagnant moisture.",
            "Inspect leaves and runners often.",
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
    "Tomato___Spider_mites Two-spotted_spider_mite": build_disease_info(
        "Tomato Spider Mites (Two-Spotted Spider Mite)",
        "Abamectin",
        "0.5 ml per liter of water",
        "Every 5 to 7 days",
        [
            "Spray undersides of leaves thoroughly.",
            "Reduce dust around crop rows.",
            "Avoid unnecessary broad-spectrum insecticides.",
        ],
    ),
    "Tomato___Target_Spot": build_disease_info(
        "Tomato Target Spot",
        "Azoxystrobin",
        "1 ml per liter of water",
        "Every 7 to 10 days",
        [
            "Avoid long periods of leaf wetness.",
            "Prune for airflow and light penetration.",
            "Remove infected crop debris after harvest.",
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
    "Tomato___healthy": build_disease_info(
        "Tomato Healthy",
        "None",
        "N/A",
        "N/A",
        [
            "Maintain consistent watering and mulching.",
            "Prune lower leaves for better airflow.",
            "Inspect plants frequently during humid weather.",
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
