import db from "../config/db.js";


// --- Fungsi Hitung Status Gizi ---
function hitungStatusGizi(usia, jenisKelamin, berat) {

    // Tabel standar WHO (disederhanakan)
    const standar = {
        L: { 12: 8.9, 24: 12.2, 36: 14.3 },
        P: { 12: 8.4, 24: 11.5, 36: 13.9 },
    };

    // Cari usia terdekat
    const nearestAge = Object.keys(standar[jenisKelamin]).reduce((prev, curr) => {
        return Math.abs(curr - usia) < Math.abs(prev - usia) ? curr : prev;
    });

    const ideal = standar[jenisKelamin][nearestAge];

    // Menentukan kategori
    if (berat < ideal * 0.85) return "Gizi Kurang";
    if (berat > ideal * 1.2) return "Risiko Obesitas";
    return "Gizi Baik";
}



// --- INSERT DATA BALITA ---
export const addRecord = (req, res) => {
    const { nama, jenis_kelamin, usia_bulan, berat_badan, tinggi_badan, lingkar_kepala } = req.body;

    if (!nama || !jenis_kelamin || !usia_bulan || !berat_badan || !tinggi_badan) {
        return res.status(400).json({ message: "Data tidak boleh kosong" });
    }

    const status_gizi = hitungStatusGizi(usia_bulan, jenis_kelamin, berat_badan);

    db.query(
        `INSERT INTO balita 
      (nama, jenis_kelamin, usia_bulan, berat_badan, tinggi_badan, lingkar_kepala, status_gizi)
     VALUES (?,?,?,?,?,?,?)`,
        [
            nama,
            jenis_kelamin,
            usia_bulan,
            berat_badan,
            tinggi_badan,
            lingkar_kepala || null,
            status_gizi
        ],
        (err) => {
            if (err) return res.status(500).json({ message: "Database error", error: err });
            res.json({ message: "Data balita berhasil ditambahkan!", status_gizi });
        }
    );
};



// --- GET DATA BALITA ---
export const getRecords = (req, res) => {
    db.query("SELECT * FROM balita ORDER BY created_at DESC", (err, result) => {
        if (err) return res.status(500).json({ message: "Error fetching data" });

        res.json(result);
    });
};

export const updateRecord = (req, res) => {
    const { nama, jenis_kelamin, usia_bulan, berat_badan, tinggi_badan, lingkar_kepala } = req.body;

    const status_gizi = hitungStatusGizi(usia_bulan, jenis_kelamin, berat_badan);

    db.query(
        `UPDATE balita SET nama=?, jenis_kelamin=?, usia_bulan=?, berat_badan=?, tinggi_badan=?, lingkar_kepala=?, status_gizi=? WHERE id=?`,
        [nama, jenis_kelamin, usia_bulan, berat_badan, tinggi_badan, lingkar_kepala, status_gizi, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ message: "Database error" });
            res.json({ message: "Data berhasil diperbarui!", status_gizi });
        }
    );
};

export const getOneRecord = (req, res) => {
    db.query(
        "SELECT * FROM balita WHERE id = ?",
        [req.params.id],
        (err, result) => {
            if (err) return res.status(500).json({ message: "Database error" });

            if (result.length === 0) {
                return res.status(404).json({ message: "Data tidak ditemukan" });
            }

            res.json(result[0]);
        }
    );
};

export const deleteRecord = (req, res) => {
    db.query("DELETE FROM balita WHERE id=?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json({ message: "Data berhasil dihapus!" });
    });
};

