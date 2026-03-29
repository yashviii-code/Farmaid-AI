from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder


BASE_DIR = Path(__file__).resolve().parent
DATASET_CANDIDATES = [
    BASE_DIR / "data" / "crop_recommendation.csv",
    BASE_DIR / "data" / "Crop_recommendation.csv",
]
MODEL_DIR = BASE_DIR / "model"
MODEL_PATH = MODEL_DIR / "crop_model.joblib"
ENCODERS_PATH = MODEL_DIR / "encoders.joblib"
LOCATION_ENCODER_PATH = MODEL_DIR / "location_encoder.joblib"
SEASON_ENCODER_PATH = MODEL_DIR / "season_encoder.joblib"
SOIL_ENCODER_PATH = MODEL_DIR / "soil_encoder.joblib"
LABEL_ENCODER_PATH = MODEL_DIR / "label_encoder.joblib"

LOCATION_VALUES = ["Gujarat", "Punjab", "Maharashtra", "Uttar Pradesh"]
SOIL_VALUES = ["Loamy", "Clay", "Sandy"]
RANDOM_STATE = 42


def resolve_dataset_path() -> Path:
    for path in DATASET_CANDIDATES:
        if path.exists():
            return path
    raise FileNotFoundError("Dataset not found in data/crop_recommendation.csv")


def load_dataset() -> pd.DataFrame:
    dataset_path = resolve_dataset_path()
    return pd.read_csv(dataset_path)


def assign_season(rainfall: float) -> str:
    if rainfall > 200:
        return "Kharif"
    if rainfall > 100:
        return "Zaid"
    return "Rabi"


def engineer_features(dataframe: pd.DataFrame) -> pd.DataFrame:
    df = dataframe.copy()
    rng = np.random.default_rng(RANDOM_STATE)

    df["season"] = df["rainfall"].apply(assign_season)
    df["location"] = rng.choice(LOCATION_VALUES, size=len(df))
    df["soil"] = rng.choice(SOIL_VALUES, size=len(df))

    return df


def encode_features(dataframe: pd.DataFrame) -> tuple[pd.DataFrame, dict[str, LabelEncoder]]:
    df = dataframe.copy()
    encoders: dict[str, LabelEncoder] = {}

    for column in ["location", "season", "soil", "label"]:
        encoder = LabelEncoder()
        df[column] = encoder.fit_transform(df[column])
        encoders[column] = encoder

    return df, encoders


def split_features_and_target(dataframe: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series]:
    X = dataframe.drop(columns=["label"])
    y = dataframe["label"]
    return X, y


def train_model(X_train: pd.DataFrame, y_train: pd.Series) -> RandomForestClassifier:
    model = RandomForestClassifier(n_estimators=100, random_state=RANDOM_STATE)
    model.fit(X_train, y_train)
    return model


def save_artifacts(model: RandomForestClassifier, encoders: dict[str, LabelEncoder]) -> None:
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    joblib.dump(encoders, ENCODERS_PATH)
    joblib.dump(encoders["location"], LOCATION_ENCODER_PATH)
    joblib.dump(encoders["season"], SEASON_ENCODER_PATH)
    joblib.dump(encoders["soil"], SOIL_ENCODER_PATH)
    joblib.dump(encoders["label"], LABEL_ENCODER_PATH)


def main() -> None:
    df = load_dataset()
    df = engineer_features(df)
    df, encoders = encode_features(df)
    X, y = split_features_and_target(df)

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=RANDOM_STATE,
    )

    model = train_model(X_train, y_train)
    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)

    print(f"Accuracy: {accuracy:.4f}")
    save_artifacts(model, encoders)
    print(f"Model saved to: {MODEL_PATH}")
    print(f"Encoders saved to: {ENCODERS_PATH}")
    print(f"Location encoder saved to: {LOCATION_ENCODER_PATH}")
    print(f"Season encoder saved to: {SEASON_ENCODER_PATH}")
    print(f"Soil encoder saved to: {SOIL_ENCODER_PATH}")
    print(f"Label encoder saved to: {LABEL_ENCODER_PATH}")


if __name__ == "__main__":
    main()
