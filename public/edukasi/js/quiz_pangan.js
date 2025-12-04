const quizData = [
    {
        q: "Rafi sering makan permen dan jarang makan lauk. Apa risiko utamanya?",
        a: ["Kurang protein → otot kurang berkembang", "Terlalu tinggi kalsium", "Bertambah kuat"],
        c: 0
    },
    {
        q: "Nina mudah sakit dan jarang makan buah. Apa zat gizi yang paling ia butuhkan?",
        a: ["Vitamin dari buah & sayur", "Minyak goreng", "Gula tambahan"],
        c: 0
    },
    {
        q: "Saat bermain bola, tubuh memerlukan energi. Makanan apa yang mendukung aktivitas ini?",
        a: ["Karbohidrat seperti nasi & roti", "Minuman bersoda", "Permen warna-warni"],
        c: 0
    },
    {
        q: "Agar otak semakin cerdas saat belajar, makanan yang sebaiknya sering dimakan adalah?",
        a: ["Alpukat & kacang (lemak sehat)", "Keripik asin", "Gula pasir"],
        c: 0
    },
    {
        q: "Ibu menyiapkan piring makan anak. Apa isi separuh piring terbaik?",
        a: ["Sayur dan buah warna-warni", "Nasi penuh sampai tumpah", "Makanan tinggi garam saja"],
        c: 0
    },
    {
        q: "Doni sering terlihat pucat dan cepat lelah. Makanan yang perlu ditambah adalah?",
        a: ["Sumber zat besi seperti hati & bayam", "Camilan manis", "Biskuit coklat"],
        c: 0
    },
    {
        q: "Agar BAB lancar dan tidak sembelit, makanan apa yang perlu diperbanyak?",
        a: ["Serat: sayur, buah, dan biji-bijian", "Keju berlebihan", "Makanan cepat saji"],
        c: 0
    },
    {
        q: "Untuk tulang kuat dan tinggi optimal, apa makanan terbaik?",
        a: ["Susu, keju, dan yogurt (kalsium)", "Minuman bersoda", "Gorengan setiap hari"],
        c: 0
    },
    {
        q: "Supaya tubuh selalu sehat, bagaimana cara makan yang baik?",
        a: ["Beragam dan bergizi seimbang", "Makan mie instan setiap hari", "Tidak makan pagi"],
        c: 0
    },
    {
        q: "Ayah mengajak makan malam. Mana pilihan menu terbaik untuk protein nabati?",
        a: ["Tahu & tempe", "Minuman bersoda", "Es krim coklat"],
        c: 0
    }
];

let i = 0, s = 0;
const quiz = document.getElementById("quiz");
const next = document.getElementById("next-btn");
const res = document.getElementById("result");
const progress = document.getElementById("progress-bar");

function load() {
    progress.style.width = `${(i / quizData.length) * 100}%`;

    const q = quizData[i];
    quiz.innerHTML = `
        <p class="question-text">${q.q}</p>
        ${q.a.map((a, n) => `
            <label class="quiz-option">
                <input type="radio" name="a" value="${n}">
                ${a}
            </label>
        `).join("")}
    `;

    document.querySelectorAll(".quiz-option").forEach(opt => {
        opt.addEventListener("click", () => {
            document.querySelectorAll(".quiz-option").forEach(o => o.classList.remove("active"));
            opt.classList.add("active");
            opt.querySelector("input").checked = true;
        });
    });
}

load();

next.onclick = () => {
    const sel = document.querySelector("input[name='a']:checked");
    if (!sel) return alert("Pilih jawaban dulu!");

    const options = document.querySelectorAll("input[name='a']");
    options.forEach(o => o.disabled = true);

    if (+sel.value === quizData[i].c) {
        sel.parentElement.classList.add("correct");
        s++;
    } else {
        sel.parentElement.classList.add("wrong");
        document.querySelectorAll(".quiz-option")[quizData[i].c].classList.add("correct");
    }

    i++;

    setTimeout(() => {
        if (i < quizData.length) load();
        else finish();
    }, 800);
};

function finish() {
    quiz.style.display = "none";
    next.style.display = "none";
    progress.style.width = "100%";

    const score = Math.round((s / quizData.length) * 100);

    res.innerHTML = `
        <h3>🎉 Selesai!</h3>
        <p>Skor kamu: <strong>${s}/${quizData.length}</strong></p>
        <p>Persentase: <strong>${score}%</strong></p>
        <button class="restart" onclick="location.reload()">Ulangi Quiz</button>
    `;
}
