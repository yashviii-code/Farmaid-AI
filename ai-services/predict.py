from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image


BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "model"
MODEL_PATH = MODEL_DIR / "disease_model.h5"
CLASS_INDICES_PATH = MODEL_DIR / "disease_class_indices.json"
IMAGE_SIZE = (224, 224)


def load_class_names() -> dict[int, str]:
    with CLASS_INDICES_PATH.open("r", encoding="utf-8") as file:
        class_indices = json.load(file)

    return {index: label for label, index in class_indices.items()}


def format_disease_name(label: str) -> str:
    formatted = label.replace("___", " - ")
    formatted = formatted.replace("_", " ")
    formatted = formatted.replace(",", "")
    formatted = formatted.replace("(", " (")
    formatted = " ".join(formatted.split())
    return formatted.strip()


MODEL = load_model(MODEL_PATH)
CLASS_NAMES = load_class_names()


def _image_to_tensor(img: Image.Image) -> np.ndarray:
    img_array = image.img_to_array(img)
    img_array = img_array / 255.0
    return np.expand_dims(img_array, axis=0)


def preprocess_image(image_path: str | Path) -> np.ndarray:
    img = image.load_img(image_path, target_size=IMAGE_SIZE)
    return _image_to_tensor(img)


def preprocess_uploaded_image(file_storage) -> np.ndarray:
    file_storage.stream.seek(0)
    img = Image.open(file_storage.stream).convert("RGB")
    img = img.resize(IMAGE_SIZE)
    return _image_to_tensor(img)


def _build_prediction_result(predictions: np.ndarray) -> dict[str, float | str]:
    predicted_index = int(np.argmax(predictions))
    confidence = float(predictions[predicted_index])
    disease_label = CLASS_NAMES[predicted_index]

    return {
        "disease_key": disease_label,
        "disease": format_disease_name(disease_label),
        "confidence": round(confidence, 4),
    }


def predict_disease(image_path: str | Path) -> dict[str, float | str]:
    input_tensor = preprocess_image(image_path)
    predictions = MODEL.predict(input_tensor, verbose=0)[0]
    return _build_prediction_result(predictions)


def predict_uploaded_file(file_storage) -> dict[str, float | str]:
    input_tensor = preprocess_uploaded_image(file_storage)
    predictions = MODEL.predict(input_tensor, verbose=0)[0]
    return _build_prediction_result(predictions)


if __name__ == "__main__":
    sample_image = input("Enter image path: ").strip()
    result = predict_disease(sample_image)
    print(result)
