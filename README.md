# 🎨 Aalma Lumière — Interactive Painting Recognition

This project was created for the multimedia artist **Aalma Lumière** and will be integrated into her official website:  
https://www.aalmalumiere.it/

Aalma Lumière is a multimedia artist whose research integrates painting, installation, and the written word. Her practice stems from an identity crisis that triggered a profound analysis of the complexity of the self and the fragmentation of the "I."

The work combines **painting, poetry, and interactive digital experience**.  
Visitors can point their webcam at one of Aalma’s paintings, and the system:

- recognizes the artwork in real time  
- triggers a poetic visual experience  
- breaks the painting into fragments  
- reveals the corresponding written piece  
- handles special compositions (the “blue paintings”) with a 3×3 selection grid  

The entire experience runs **client‑side**, directly in the browser.

---

## 🧠 How It Works

The project is built around a hybrid workflow:

### **1. Offline Processing (Python)**
A Python script generates **image embeddings** using TensorFlow (CPU version):

- loads all paintings from `assets/paintings` and `assets/blue_paintings`
- computes embeddings with MobileNetV2
- exports them into `embeddings.json`

This file is used by the browser for fast similarity search.

### **2. Online Recognition (Browser)**
The browser uses:

- **TensorFlow.js** to compute embeddings from the webcam stream  
- a custom **cosine similarity** matcher  
- a stable detection system (1 second of consistent recognition)  
- a special handler for the “blue compositions”  
- a physics‑based breaking animation (canvas + particles)

Everything runs locally — no server, no backend.

---

## 🎥 Features

### ✔ Real‑time webcam recognition  
The system identifies the closest painting using precomputed embeddings.

### ✔ Stable detection  
A painting must be recognized consistently for 1 second before triggering the experience.

### ✔ Interactive experience  
Once recognized:

- the painting appears on screen  
- it breaks into fragments using a physics simulation  
- the corresponding poem fades in underneath  

### ✔ Special case: Blue Compositions  
If the recognized painting belongs to the “blue” series:

- a 3×3 grid appears  
- the visitor chooses the correct fragment  
- **blu_11** is handled as a special case (no breaking animation)

### ✔ Fully client‑side  
No data is uploaded.  
Everything runs in the browser.

---

## 📁 Project Structure

```bash
/assets
    /paintings
    /blue_paintings
    /poetry
embeddings.json
index.html
style.css
recognizer.js
physics.js
generate_embeddings.py
requirements.txt
```


---

## 🔧 Python Environment

To recreate the embedding environment:

```bash
python -m venv embeddings_env
source embeddings_env/bin/activate   # macOS / Linux
embeddings_env\Scripts\activate      # Windows
pip install -r requirements.txt

python generate_embeddings.py
```

## 📜 License

This project is intended for artistic and educational use.
All artworks and poems are © Aalma Lumière.


