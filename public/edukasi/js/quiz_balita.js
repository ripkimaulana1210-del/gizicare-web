const quizData = [
    {
        q: "Seorang bayi berusia 4 bulan. Ia sering menangis saat lapar. Apa makanan terbaik untuknya?",
        a: ["ASI eksklusif", "MPASI puree buah", "Susu kental manis"],
        c: 0
    },
    {
        q: "Ibu Rina ingin MPASI untuk anak usia 6 bulan. Pilihan awal yang benar adalah?",
        a: ["Bubur halus kaya zat besi", "Nasi goreng", "Keripik dan kue"],
        c: 0
    },
    {
        q: "Doni suka minum teh manis setiap hari. Apa risiko utamanya?",
        a: ["Kurang penyerapan zat besi → anemia", "Tidur lebih nyenyak", "Pertumbuhan lebih cepat"],
        c: 0
    },
    {
        q: "Anak terlihat pucat, cepat lelah, dan kurang aktif. Kemungkinan kekurangan apa?",
        a: ["Zat besi", "Vitamin C", "Lemak"],
        c: 0
    },
    {
        q: "Agar anak tidak mudah bosan makan, apa yang sebaiknya dilakukan?",
        a: [
            "Variasikan warna dan bentuk makanan",
            "Berikan makanan yang sama tiap hari",
            "Jangan ajak anak bicara saat makan"
        ],
        c: 0
    },
    {
        q: "Untuk perkembangan otak, makanan apa yang baik diberikan?",
        a: ["Ikan dan alpukat", "Kerupuk", "Ekstra saus pedas"],
        c: 0
    },
    {
        q: "Anak diare karena jajan sembarangan. Minuman terbaik untuk pemulihan adalah?",
        a: ["Oralit / air putih", "Soda", "Kopi dingin"],
        c: 0
    },
    {
        q: "Berapa kali makan ideal untuk balita per hari?",
        a: ["3x makan + 2–3x cemilan sehat", "1x makan saja", "6x cemilan manis"],
        c: 0
    },
    {
        q: "Saat anak sulit makan sayur, apa yang bisa dilakukan?",
        a: [
            "Campur sayur dalam makanan favorit",
            "Paksa makan sampai habis",
            "Hapus sayur dari menu"
        ],
        c: 0
    },
    {
        q: "Mana contoh menu lengkap dalam satu piring?",
        a: [
            "Nasi + ayam + sayur + buah",
            "Nasi saja",
            "Mie instan + minuman manis"
        ],
        c: 0
    }
];

let index = 0, score = 0;
const quiz = document.getElementById("quiz");
const result = document.getElementById("result");
const nextBtn = document.getElementById("next-btn");
const progressBar = document.getElementById("progress-bar");

function loadQuiz() {
    progressBar.style.width = `${(index / quizData.length) * 100}%`;

    const q = quizData[index];
    quiz.innerHTML = `
        <p class="question-text">${q.q}</p>
        ${q.a.map((ans, i) => `
            <label class="quiz-option">
                <input type="radio" name="ans" value="${i}">
                ${ans}
            </label>
        `).join("")}
    `;

    document.querySelectorAll(".quiz-option").forEach(option => {
        option.addEventListener("click", () => {
            document.querySelectorAll(".quiz-option")
                .forEach(o => o.classList.remove("active"));
            option.classList.add("active");
            option.querySelector("input").checked = true;
        });
    });
}

loadQuiz();

nextBtn.onclick = () => {
    const selected = document.querySelector("input[name='ans']:checked");
    if (!selected) return alert("Silakan pilih jawaban!");

    const options = document.querySelectorAll(".quiz-option input");
    options.forEach(opt => opt.disabled = true);

    if (+selected.value === quizData[index].c) {
        selected.parentElement.classList.add("correct");
        score++;
    } else {
        selected.parentElement.classList.add("wrong");
        document.querySelectorAll(".quiz-option")[quizData[index].c].classList.add("correct");
    }

    index++;

    setTimeout(() => {
        if (index < quizData.length) loadQuiz();
        else finishQuiz();
    }, 800);
};

function finishQuiz() {
    quiz.style.display = "none";
    nextBtn.style.display = "none";
    progressBar.style.width = "100%";

    const percentage = Math.round((score / quizData.length) * 100);

    result.innerHTML = `
        <h3>🎉 Quiz Selesai!</h3>
        <p>Skor kamu: <strong>${score}/${quizData.length}</strong></p>
        <p>Persentase: <strong>${percentage}%</strong></p>
        <button class="restart" onclick="location.reload()">Ulangi Quiz</button>
    `;
}
