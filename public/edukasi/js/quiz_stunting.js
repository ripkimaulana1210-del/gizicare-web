const quizData = [
    {
        q: "Seorang ibu hamil jarang makan makanan bergizi dan tidak rutin periksa kehamilan. Risiko yang dapat terjadi pada anaknya adalah?",
        a: ["Stunting sejak lahir", "Anak jadi lebih kuat", "Tidak ada pengaruh"], c: 0
    },

    {
        q: "Kenapa stunting dapat menurunkan kecerdasan anak?",
        a: ["Otak tidak berkembang optimal karena kurang nutrisi", "Anak terlalu banyak bermain", "Karena faktor warna rambut"], c: 0
    },

    {
        q: "Anak usia 7 bulan hanya diberi bubur instan tanpa lauk. Apa masalahnya?",
        a: ["Kurang nutrisi penting untuk tumbuh kembang", "Agar tidak boros", "Sudah cukup untuk kuat"], c: 0
    },

    {
        q: "Jika anak sering sakit dan tidak diobati, hal tersebut dapat menyebabkan…",
        a: ["Gangguan pertumbuhan", "Anak jadi lebih tinggi", "Makin kebal tanpa imunisasi"], c: 0
    },

    {
        q: "Mengapa ASI eksklusif 6 bulan sangat dianjurkan?",
        a: ["Mengandung nutrisi lengkap & perlindungan infeksi", "Agar ibu tidak capek memasak", "Karena semua orang begitu"], c: 0
    },

    {
        q: "Bagaimana sanitasi buruk dapat memicu stunting?",
        a: ["Memicu diare → nutrisi tidak terserap", "Membuat anak lebih gemuk", "Menambah napsu makan"], c: 0
    },

    {
        q: "Kapan waktu terbaik mulai mengenalkan MP-ASI bergizi seimbang?",
        a: ["6 bulan", "2 bulan", "1 tahun"], c: 0
    },

    {
        q: "Apa peran imunisasi dalam mencegah stunting?",
        a: ["Mencegah penyakit yang menghambat pertumbuhan", "Agar anak tidak menangis", "Supaya anak gemuk"], c: 0
    },

    {
        q: "Orang tua memberi anak hanya makanan karbohidrat (nasi/roti) setiap hari. Dampaknya?",
        a: ["Kurang zat gizi lain → risiko stunting", "Anak pasti lebih pintar", "Tidak ada masalah"], c: 0
    },

    {
        q: "Jika tinggi anak jauh di bawah standar usia, apa langkah terbaik orang tua?",
        a: ["Segera periksa ke Posyandu/Puskesmas", "Abaikan saja", "Tunggu sampai remaja mungkin tinggi"], c: 0
    }
];

let i = 0, s = 0;
const quiz = document.getElementById("quiz");
const res = document.getElementById("result");
const next = document.getElementById("next-btn");
const progress = document.getElementById("progress-bar");

function load() {
    const q = quizData[i];
    quiz.innerHTML = `<p>${q.q}</p>` + q.a.map((a, n) => `
        <label class="quiz-option">
            <input type="radio" name="a" value="${n}">
            ${a}
        </label>`).join("");

    // Tambahkan event click untuk highlight
    document.querySelectorAll(".quiz-option").forEach(opt => {
        opt.addEventListener("click", () => {
            document.querySelectorAll(".quiz-option")
                .forEach(o => o.classList.remove("active"));
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
    options.forEach(opt => opt.disabled = true); // Kunci pilihan

    if (+sel.value === quizData[i].c) {
        sel.parentElement.classList.add("correct");
        s++;
    } else {
        sel.parentElement.classList.add("wrong");
    }

    i++;

    setTimeout(() => {
        if (i < quizData.length) {
            load();
        } else {
            finish();
        }
    }, 600);
};

function finish() {
    quiz.style.display = "none";
    next.style.display = "none";
    progress.style.width = "100%";

    const score = Math.round((s / quizData.length) * 100);
    res.innerHTML = `
        <h3>🎉 Kamu selesai!</h3>
        <p>Skor kamu: <strong>${s}/${quizData.length}</strong></p>
        <p>Persentase: <strong>${score}%</strong></p>
        <button class="restart" onclick="location.reload()">Ulangi Quiz</button>
    `;
}
