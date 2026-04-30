import os
import json
import numpy as np
import tensorflow as tf

# 🔹 Modello corretto (1280-dim)
model = tf.keras.applications.MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights="imagenet",
    pooling="avg"
)

assets_dir = "assets"
embeddings = {}

for filename in os.listdir(assets_dir):
    if filename.lower().endswith((".jpg", ".jpeg", ".png")):
        path = os.path.join(assets_dir, filename)

        try:
            # Carica immagine
            img = tf.keras.utils.load_img(path, target_size=(224, 224))
            x = tf.keras.utils.img_to_array(img)

            # Preprocessing MobileNetV2 (IMPORTANTISSIMO)
            x = tf.keras.applications.mobilenet_v2.preprocess_input(x)
            x = np.expand_dims(x, axis=0)

            # Embedding (1280)
            emb = model.predict(x, verbose=0)[0]

            embeddings[filename] = emb.tolist()

            print(f"{filename} -> {len(emb)}")

        except Exception as e:
            print(f"Errore con {filename}: {e}")

# 🔹 Salvataggio
with open("embeddings.json", "w") as f:
    json.dump(embeddings, f)

print("\nFatto. embeddings.json creato.")