# 🎨 Composizioni — Image Embeddings Project

This project explores the generation and comparison of **image embeddings** using a hybrid workflow:  
Python is used offline to compute embeddings with TensorFlow, while the browser uses TensorFlow.js to compare new images against the precomputed dataset. The goal is to create a lightweight, client‑side tool capable of identifying visual similarities between images.

---

## 🧠 Project Overview

The workflow is divided into two main stages:

### **1. Python (offline processing)**
- A Python script loads images from a dataset.
- A TensorFlow model (CPU version) generates embeddings.
- The embeddings are exported into a JSON file (`embeddings.json`).
- This file is later consumed by the browser.

### **2. Browser (online comparison)**
- A TensorFlow.js model computes embeddings for user‑uploaded images (webcam).
- The browser compares these embeddings with the precomputed ones.
- It returns the closest match and the distance score.

This approach keeps the browser lightweight while allowing Python to handle the heavier preprocessing.

---

## 🔧 Python Virtual Environment

All Python processing was performed inside a dedicated virtual environment named **`embeddings_env`**.  
The environment itself is **not included in the repository** to avoid uploading large compiled libraries (such as TensorFlow DLLs).

To recreate the environment:

```bash
python -m venv embeddings_env
embeddings_env\Scripts\activate
```
All required Python packages are listed in: requirements.txt. To install them :
```bash
pip install -r requirements.txt
```

