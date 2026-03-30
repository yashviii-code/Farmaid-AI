from __future__ import annotations

import os
import re

import cv2
import numpy as np
import pytesseract
from PIL import UnidentifiedImageError
from pytesseract import TesseractNotFoundError


if os.environ.get("TESSERACT_CMD"):
    pytesseract.pytesseract.tesseract_cmd = os.environ["TESSERACT_CMD"]


FIELD_PATTERNS = {
    "N": [
        r"\b(?:nitrogen|n)\b\s*[:=\-]?\s*(\d+(?:\.\d+)?)",
    ],
    "P": [
        r"\b(?:phosphorus|phosphorous|p)\b\s*[:=\-]?\s*(\d+(?:\.\d+)?)",
    ],
    "K": [
        r"\b(?:potassium|k)\b\s*[:=\-]?\s*(\d+(?:\.\d+)?)",
    ],
    "ph": [
        r"\bp\s*h\b\s*[:=\-]?\s*(\d+(?:\.\d+)?)",
        r"\bph\b\s*[:=\-]?\s*(\d+(?:\.\d+)?)",
    ],
    "temperature": [
        r"\b(?:temperature|temp)\b\s*[:=\-]?\s*(\d+(?:\.\d+)?)",
    ],
    "humidity": [
        r"\b(?:humidity|humid(?:ity)?)\b\s*[:=\-]?\s*(\d+(?:\.\d+)?)",
    ],
    "rainfall": [
        r"\b(?:rainfall|rain\s*fall)\b\s*[:=\-]?\s*(\d+(?:\.\d+)?)",
    ],
}

NUMERIC_FIELDS = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]


def infer_season_from_rainfall(rainfall: float | int | None) -> str:
    if rainfall is None:
        return "Rabi"
    if float(rainfall) > 200:
        return "Kharif"
    if float(rainfall) > 100:
        return "Zaid"
    return "Rabi"


def _normalize_numeric_value(field_name: str, value: float) -> int | float:
    if field_name in {"N", "P", "K", "temperature", "humidity", "rainfall"}:
        return int(round(value))
    return round(value, 2)


def _extract_numeric_value(text: str, patterns: list[str]) -> float | None:
    for pattern in patterns:
        match = re.search(pattern, text, flags=re.IGNORECASE)
        if match:
            return float(match.group(1))
    return None


def parse_soil_report_text(text: str) -> tuple[dict[str, int | float], list[str]]:
    extracted = {}
    missing_fields = []

    for field_name in NUMERIC_FIELDS:
        raw_value = _extract_numeric_value(text, FIELD_PATTERNS[field_name])
        if raw_value is None:
            missing_fields.append(field_name)
            continue
        extracted[field_name] = _normalize_numeric_value(field_name, raw_value)

    return extracted, missing_fields


def _preprocess_for_ocr(file_bytes: bytes) -> np.ndarray:
    np_buffer = np.frombuffer(file_bytes, dtype=np.uint8)
    image = cv2.imdecode(np_buffer, cv2.IMREAD_COLOR)
    if image is None:
        raise UnidentifiedImageError("Invalid image file")

    grayscale = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    grayscale = cv2.resize(grayscale, None, fx=1.6, fy=1.6, interpolation=cv2.INTER_CUBIC)
    blurred = cv2.GaussianBlur(grayscale, (5, 5), 0)
    _, thresholded = cv2.threshold(
        blurred,
        0,
        255,
        cv2.THRESH_BINARY + cv2.THRESH_OTSU,
    )
    return thresholded


def extract_text_from_uploaded_file(file_storage) -> str:
    try:
        file_storage.stream.seek(0)
        file_bytes = file_storage.read()
        file_storage.stream.seek(0)
        if not file_bytes:
            raise ValueError("Uploaded image is empty")

        processed_image = _preprocess_for_ocr(file_bytes)
        text = pytesseract.image_to_string(processed_image, config="--oem 3 --psm 6")
        return text.strip()
    except TesseractNotFoundError as exc:
        raise RuntimeError(
            "Tesseract OCR is not installed or not found. Install Tesseract and set TESSERACT_CMD if needed."
        ) from exc

