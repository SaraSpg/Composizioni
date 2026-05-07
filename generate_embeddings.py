import os
import json
import numpy as np
import tensorflow as tf

# Modello corretto (1280-dim)
model = tf.keras.applications.MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights="imagenet",
    pooling="avg"
)

# Cartelle da processare
folders = [
    "assets/paintings",
    "assets/blue_paintings"
]

embeddings = {}

# File da escludere
EXCLUDED = {"blu_11.jpg"}

def process_folder(folder):
    for filename in os.listdir(folder):

        # Esclusione specifica
        if filename in EXCLUDED:
            continue

        if filename.lower().endswith((".jpg", ".jpeg", ".png")):
            path = os.path.join(folder, filename)

            try:
                img = tf.keras.utils.load_img(path, target_size=(224, 224))
                x = tf.keras.utils.img_to_array(img)

                x = tf.keras.applications.mobilenet_v2.preprocess_input(x)
                x = np.expand_dims(x, axis=0)

                emb = model.predict(x, verbose=0)[0]

                embeddings[filename] = emb.tolist()

                print(f"{filename} -> {len(emb)}")

            except Exception as e:
                print(f"Errore con {filename}: {e}")


# Processa entrambe le cartelle
for folder in folders:
    process_folder(folder)

# Salvataggio
with open("embeddings.json", "w") as f:
    json.dump(embeddings, f)

print("\nFatto. embeddings.json creato.")
