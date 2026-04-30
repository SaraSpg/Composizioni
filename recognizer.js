let model = null;
let embeddings = null;

let lastRun = 0;
const INTERVAL = 300;

// ==========================
// MODEL
// ==========================
async function loadModel() {
    console.log("Caricamento modello LOCALE...");

    model = await tf.loadGraphModel("./models/mobilenet/model.json");

    console.log("MODEL OUTPUTS:", model.outputs);
    console.log("Modello caricato correttamente");
}

// ==========================
// EMBEDDINGS
// ==========================
async function loadEmbeddings() {
    const res = await fetch("./embeddings.json");
    embeddings = await res.json();

    const first = Object.values(embeddings)[0];

    console.log("Embeddings caricati:", Object.keys(embeddings));

    if (!first || first.length !== 1280) {
        throw new Error("❌ Embeddings NON validi (atteso 1280)");
    }
}

// ==========================
// PREPROCESS
// ==========================
function preprocessFrame(video) {
    return tf.tidy(() => {
        return tf.browser.fromPixels(video)
            .resizeBilinear([224, 224])
            .toFloat()
            .div(127.5)
            .sub(1)
            .expandDims(0);
    });
}

// ==========================
// COSINE
// ==========================
function cosineSimilarity(a, b) {
    const ta = tf.tensor1d(a);
    const tb = tf.tensor1d(b);

    const dot = tf.dot(ta, tb);
    const norm = tf.norm(ta).mul(tf.norm(tb));

    const result = dot.div(norm).dataSync()[0];

    ta.dispose();
    tb.dispose();
    dot.dispose();
    norm.dispose();

    return result;
}

// ==========================
// MATCHING
// ==========================
function findBestMatch(embedding, threshold = 0.55) {
    let bestName = null;
    let bestScore = -1;

    for (const [name, vector] of Object.entries(embeddings)) {
        const score = cosineSimilarity(embedding, vector);

        console.log("SCORE:", name, score);

        if (score > bestScore) {
            bestScore = score;
            bestName = name;
        }
    }

    if (bestScore >= threshold) {
        return { bestName, bestScore };
    }

    return null;
}

// ==========================
// RICONOSCIMENTO
// ==========================
async function recognizeFrame(video) {
    const now = Date.now();

    if (now - lastRun < INTERVAL) {
        return { skip: true };
    }

    lastRun = now;

    const input = preprocessFrame(video);
    const embeddingTensor = model.execute(input);

    const embedding = Array.from(embeddingTensor.dataSync());

    input.dispose();
    embeddingTensor.dispose();

    return findBestMatch(embedding);
}

// ==========================
// INIT
// ==========================
async function initRecognizer() {
    await loadModel();
    await loadEmbeddings();

    console.log("Recognizer pronto");
}
export { initRecognizer, recognizeFrame };