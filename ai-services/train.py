from __future__ import annotations

import json
from pathlib import Path

import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.callbacks import ModelCheckpoint
from tensorflow.keras.layers import Dense, Dropout, GlobalAveragePooling2D
from tensorflow.keras.models import Sequential
from tensorflow.keras.preprocessing.image import ImageDataGenerator


BASE_DIR = Path(__file__).resolve().parent
DATASET_DIR = BASE_DIR / "data" / "plant_disease"
TRAIN_DIR = DATASET_DIR / "train"
VALID_DIR = DATASET_DIR / "valid"
MODEL_DIR = BASE_DIR / "model"
MODEL_PATH = MODEL_DIR / "disease_model.h5"
CLASS_INDICES_PATH = MODEL_DIR / "disease_class_indices.json"

IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 5
SEED = 42


def create_generators():
    if not TRAIN_DIR.exists() or not VALID_DIR.exists():
        raise FileNotFoundError(
            f"Expected dataset folders at {TRAIN_DIR} and {VALID_DIR}"
        )

    train_datagen = ImageDataGenerator(
        rescale=1.0 / 255,
        rotation_range=20,
        zoom_range=0.2,
        horizontal_flip=True,
    )
    valid_datagen = ImageDataGenerator(rescale=1.0 / 255)

    train_generator = train_datagen.flow_from_directory(
        TRAIN_DIR,
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode="categorical",
        shuffle=True,
        seed=SEED,
    )

    valid_generator = valid_datagen.flow_from_directory(
        VALID_DIR,
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode="categorical",
        shuffle=False,
        seed=SEED,
    )

    if train_generator.class_indices != valid_generator.class_indices:
        raise ValueError(
            "Train and validation class mappings do not match. "
            "Ensure both folders contain the same class subdirectories."
        )

    return train_generator, valid_generator


def build_model(num_classes: int) -> Sequential:
    base_model = MobileNetV2(
        weights="imagenet",
        include_top=False,
        input_shape=(IMAGE_SIZE[0], IMAGE_SIZE[1], 3),
    )
    base_model.trainable = False

    model = Sequential(
        [
            base_model,
            GlobalAveragePooling2D(),
            Dense(128, activation="relu"),
            Dropout(0.5),
            Dense(num_classes, activation="softmax"),
        ]
    )

    model.compile(
        optimizer="adam",
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    return model


def build_callbacks() -> list[ModelCheckpoint]:
    MODEL_DIR.mkdir(parents=True, exist_ok=True)

    checkpoint = ModelCheckpoint(
        filepath=str(MODEL_PATH),
        monitor="val_accuracy",
        mode="max",
        save_best_only=True,
        save_weights_only=False,
        verbose=1,
    )

    return [checkpoint]


def save_class_indices(class_indices: dict[str, int]) -> None:
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    with CLASS_INDICES_PATH.open("w", encoding="utf-8") as file:
        json.dump(class_indices, file, indent=2, ensure_ascii=True)


def main() -> None:
    train_generator, valid_generator = create_generators()
    model = build_model(train_generator.num_classes)
    callbacks = build_callbacks()
    save_class_indices(train_generator.class_indices)

    model.fit(
        train_generator,
        validation_data=valid_generator,
        epochs=EPOCHS,
        callbacks=callbacks,
    )

    print(f"Best model saved to: {MODEL_PATH}")
    print(f"Class indices saved to: {CLASS_INDICES_PATH}")


if __name__ == "__main__":
    tf.random.set_seed(SEED)
    main()
