/* masalah.js — AI Lokal tingkat lanjut (multi-turn, weighted scoring, red-flag, follow-up) */

/* ---------- 1) Knowledge base: gejala -> penyakit (keywords + weight) ---------- */
const gejalaDB = {
    anemia: { keywords: ["pucat", "pale", "lelah", "letih", "capek", "pusing", "napas cepat", "berdebar", "kuku rapuh", "rambut rontok"], weight: 3 },
    malnutrisi: { keywords: ["berat turun", "kurus", "kurang makan", "tidak nafsu makan", "nafsu makan turun"], weight: 4 },
    stunting: { keywords: ["anak pendek", "pertumbuhan lambat", "stunting"], weight: 5 },
    diabetes: { keywords: ["sering haus", "sering kencing", "lapar terus", "kesemutan", "berat turun drastis"], weight: 4 },
    kurang_vit_c: { keywords: ["gusi berdarah", "memar", "kebas gusi"], weight: 2 },
    dehidrasi: { keywords: ["haus", "mulut kering", "pusing berdiri", "kering"], weight: 2 },
    maag: { keywords: ["mual", "muntah", "perut perih", "asam naik", "kembung"], weight: 2 },
    hipertensi_symptom: { keywords: ["sakit kepala hebat", "mata kabur", "pusing hebat"], weight: 3 },
    ginjal: { keywords: ["bengkak kaki", "urin sedikit", "kencing sedikit", "mual pagi"], weight: 5 },
    liver: { keywords: ["mata kuning", "kulit kuning", "perut bengkak"], weight: 5 }
};

/* ---------- 2) Diagnosis detail (nama, penyebab, solusi, rencana 3 hari, rekomendasi makanan) ---------- */
const diagnosisAI = {
    anemia: {
        nama: "Anemia (Kemungkinan Defisiensi Besi)",
        penyebab: "Kurang asupan zat besi atau gangguan penyerapan.",
        solusi: ["Perbanyak makanan kaya zat besi (daging merah, hati, bayam)", "Konsumsi vitamin C bersama makanan berzat besi", "Hindari teh/kopi berlebihan setelah makan"],
        rencana3hari: ["Hari 1: Sarapan telur + jus jeruk; Hari 2: Nasi + ayam + tumis bayam; Hari 3: Ikan + sayur hijau"],
        makanan: ["Daging sapi", "Hati ayam", "Bayam", "Jeruk"]
    },

    malnutrisi: {
        nama: "Risiko Malnutrisi / Kekurangan Kalori",
        penyebab: "Asupan kalori & protein tidak mencukupi.",
        solusi: ["Makan lebih sering (5-6x/hari)", "Tambahkan susu tinggi kalori & camilan bergizi", "Perbanyak protein hewani"],
        rencana3hari: ["Hari 1: Susu + roti selai kacang; Hari 2: Nasi + alpukat + ayam; Hari 3: Ikan + telur + buah"],
        makanan: ["Alpukat", "Telur", "Susu", "Kacang-kacangan"]
    },

    stunting: {
        nama: "Risiko Stunting (pertumbuhan lambat)",
        penyebab: "Kekurangan gizi kronis selama periode pertumbuhan.",
        solusi: ["Perbaiki gizi (1000 HPK), protein hewani harian", "Konsultasi ke posyandu/puskesmas untuk pemantauan"],
        rencana3hari: ["Hari 1: Telur + susu; Hari 2: Ikan + sayur; Hari 3: Ayam + buah"],
        makanan: ["Telur", "Ikan", "Susu"]
    },

    diabetes: {
        nama: "Kemungkinan Diabetes / Gangguan Metabolik",
        penyebab: "Disregulasi gula darah, pola makan tinggi gula.",
        solusi: ["Periksa gula darah ke fasilitas kesehatan", "Kurangi gula dan makanan olahan", "Konsumsi makanan berserat"],
        rencana3hari: ["Hari 1: Oatmeal + buah rendah gula; Hari 2: Sayur + protein; Hari 3: Salad + ikan"],
        makanan: ["Oatmeal", "Sayuran", "Ikan"]
    },

    kurang_vit_c: {
        nama: "Kemungkinan Defisiensi Vitamin C",
        penyebab: "Asupan buah rendah.",
        solusi: ["Konsumsi jeruk, jambu, pepaya setiap hari"],
        rencana3hari: ["Hari 1: Jus jeruk; Hari 2: Pepaya; Hari 3: Jambu biji"],
        makanan: ["Jeruk", "Jambu biji", "Pepaya"]
    },

    dehidrasi: {
        nama: "Dehidrasi Ringan-Sedang",
        penyebab: "Asupan cairan kurang, kehilangan cairan.",
        solusi: ["Minum 6-8 gelas/hari", "Oralit bila diare"],
        rencana3hari: ["Hari 1: Air kelapa + sup; Hari 2: Buah berair; Hari 3: perbanyak cairan"],
        makanan: ["Air kelapa", "Semangka", "Sup"]
    },

    maag: {
        nama: "Gastritis / Maag",
        penyebab: "Asam lambung naik, pola makan tidak teratur.",
        solusi: ["Jangan telat makan", "Hindari pedas & asam", "Periksa ke dokter jika muntah darah"],
        rencana3hari: ["Hari 1: Bubur/pepaya; Hari 2: Bubur ayam; Hari 3: Sup ayam"],
        makanan: ["Pisang", "Bubur", "Sup ayam"]
    },

    ginjal: {
        nama: "Kemungkinan Gangguan Ginjal",
        penyebab: "Infeksi/penyakit ginjal → butuh pemeriksaan segera",
        solusi: ["Segera periksa ke fasilitas kesehatan", "Hindari obat-obatan sembarangan"],
        rencana3hari: ["Segera pemeriksaan"], makanan: ["-"]
    },

    liver: {
        nama: "Kemungkinan Gangguan Hati",
        penyebab: "Banyak penyebab serius — periksa segera",
        solusi: ["Periksa ke dokter/IGD segera jika mata/ kulit kuning"],
        rencana3hari: ["Segera pemeriksaan"], makanan: ["-"]
    }
};

/* ---------- 3) Red flags (kata kunci yg perlu tindakan segera) ---------- */
const redFlags = ["pingsan", "muntah darah", "berat turun drastis", "mata kuning", "demam tinggi", "kejang", "sulit bernapas", "nyeri dada"];

/* ---------- 4) State & UI helpers ---------- */
const outputEl = document.getElementById("output");
const inputEl = document.getElementById("userInput");

function appendMessage(role, html) {
    const div = document.createElement("div");
    div.className = "message " + (role === "user" ? "user" : "ai");
    div.innerHTML = html;
    outputEl.appendChild(div);
    outputEl.scrollTop = outputEl.scrollHeight;
}

/* ---------- 5) Analysis engine (NLP ringan + weighted scoring) ---------- */
function analyzeText(text) {
    const t = text.toLowerCase();
    // detect red flags
    const foundFlags = redFlags.filter(f => t.includes(f));

    // compute score per condition
    const scores = [];
    for (const [key, meta] of Object.entries(gejalaDB)) {
        let s = 0;
        meta.keywords.forEach(k => { if (t.includes(k)) s += meta.weight; });
        if (s > 0) scores.push({ key, score: s });
    }

    // sort descending
    scores.sort((a, b) => b.score - a.score);
    return { scores, foundFlags };
}

/* ---------- 6) Generate human-friendly response ---------- */
function generateReply(analysis) {
    let html = "";

    // red-flag priority
    if (analysis.foundFlags.length) {
        html += `<div class="alert red"><strong>⚠ PERINGATAN MEDIS:</strong> Terdeteksi gejala serius: <b>${analysis.foundFlags.join(", ")}</b>.<br>Segera kunjungi fasilitas kesehatan/IGD.</div>`;
    }

    if (analysis.scores.length === 0) {
        html += `<div>Saya belum menemukan pola gejala yang jelas. Bisa jelaskan sejak kapan gejala muncul dan apakah ada demam/penurunan berat badan yang signifikan?</div>`;
        return html;
    }

    // take top 3
    const top = analysis.scores.slice(0, 3);
    const combinedFoods = new Set();

    top.forEach(item => {
        const code = item.key;
        const info = diagnosisAI[code];
        if (!info) return;
        // confidence heuristics
        const conf = Math.min(40 + item.score * 8, 97).toFixed(0);

        html += `<div class="diagnosis-box">
      <h3>🔎 ${info.nama}</h3>
      <p><strong>Tingkat keyakinan:</strong> ${conf}%</p>
      <p><strong>Penyebab umum:</strong> ${info.penyebab ?? "—"}</p>
      <p><strong>Saran singkat:</strong></p>
      <ul>${info.solusi.map(s => `<li>${s}</li>`).join("")}</ul>
      <p><strong>Rencana pemulihan (3 hari):</strong></p>
      <ul>${info.rencana3hari.map(s => `<li>${s}</li>`).join("")}</ul>
      ${info.makanan && info.makanan.length ? `<p><strong>Contoh makanan direkomendasikan:</strong> ${info.makanan.join(", ")}</p>` : ""}
    </div><hr>`;
        (info.makanan || []).forEach(m => combinedFoods.add(m));
    });

    if (combinedFoods.size > 0) {
        html += `<div><strong>Rekomendasi makanan gabungan:</strong> ${[...combinedFoods].join(", ")}</div>`;
    }

    return html;
}

/* ---------- 7) Dialog manager: multi-turn handling ---------- */
const dialogState = {
    waitingClarify: false,
    clarifyFor: null,
    lastAnalysis: null
};

function handleUserInput(text) {
    // show user
    appendMessage("user", text);

    // analyze
    const analysis = analyzeText(text);
    dialogState.lastAnalysis = analysis;

    // if red flags found -> immediate
    if (analysis.foundFlags.length) {
        const reply = generateReply(analysis);
        appendMessage("ai", reply);
        // reset clarify state
        dialogState.waitingClarify = false;
        dialogState.clarifyFor = null;
        return;
    }

    // if analysis weak/ambiguous => ask clarifying Q
    if (analysis.scores.length === 0) {
        appendMessage("ai", "Saya belum cukup informasi. Sejak kapan gejala ini mulai terasa dan apakah ada demam atau penurunan berat badan?");
        dialogState.waitingClarify = true;
        dialogState.clarifyFor = "onset";
        return;
    }

    // if top score low or multiple close scores -> ask focused question
    const top = analysis.scores[0];
    const second = analysis.scores[1];
    if (top.score < 6 && second && (top.score - second.score) < 3) {
        appendMessage("ai", `Ada beberapa kemungkinan: ${analysis.scores.slice(0, 2).map(s => s.key).join(" & ")}. Apakah kamu merasakan pusing berat atau penurunan nafsu makan yang signifikan?`);
        dialogState.waitingClarify = true;
        dialogState.clarifyFor = "severity";
        return;
    }

    // confident -> produce full reply
    const reply = generateReply(analysis);
    appendMessage("ai", reply);
    dialogState.waitingClarify = false;
    dialogState.clarifyFor = null;
}

/* ---------- 8) Hook UI ---------- */
document.getElementById("sendBtn").addEventListener("click", () => {
    const text = inputEl.value.trim();
    if (!text) return;

    // if waiting for clarification, append that info to previous text and re-run analysis
    if (dialogState.waitingClarify && dialogState.clarifyFor) {
        // combine previous user text(s) with clarification to enrich analysis
        const combined = (dialogState.lastRawText ? (dialogState.lastRawText + ". ") : "") + " " + text;
        // run analysis on combined
        dialogState.lastRawText = combined;
        handleUserInput(combined);
        inputEl.value = "";
        return;
    }

    // store raw
    dialogState.lastRawText = text;
    handleUserInput(text);
    inputEl.value = "";
});

/* optional: press Enter to send */
inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        document.getElementById("sendBtn").click();
    }
});
