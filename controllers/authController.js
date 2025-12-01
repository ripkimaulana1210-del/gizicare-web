import db from "../config/db.js";
import bcrypt from "bcryptjs";
import { sendOTP } from "../utils/sendEmail.js";

// REGISTER
export const register = (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword)
    return res.status(400).json({ message: "Semua field wajib diisi" });

  if (password !== confirmPassword)
    return res.status(400).json({ message: "Password tidak sama!" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expired = new Date(Date.now() + 5 * 60 * 1000); // 5 menit

  bcrypt.hash(password, 10, (err, hashed) => {
    if (err) return res.status(500).json({ message: "Hash error" });

    const sql = `
      INSERT INTO users (username, email, password, otp_code, otp_expired)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [username, email, hashed, otp, expired], async (error, results) => {
      if (error) {
        console.error("INSERT ERROR:", error);
        // jika duplicate email/username -> kode error ER_DUP_ENTRY
        if (error.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Email atau username sudah dipakai" });
        }
        return res.status(500).json({ message: "Database error" });
      }

      const ok = await sendOTP(email, otp);
      if (!ok) {
        // bila email gagal dikirim, rollback insert (opsional)
        db.query("DELETE FROM users WHERE email = ?", [email]);
        return res.status(500).json({ message: "Gagal mengirim OTP. Coba lagi." });
      }

      res.json({ message: "Registrasi berhasil, cek email untuk OTP" });
    });
  });
};

// VERIFIKASI OTP
export const verifyOTP = (req, res) => {
  const { email, otp } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (!result || result.length === 0)
      return res.status(404).json({ message: "Email tidak ditemukan" });

    const user = result[0];

    if (!user.otp_code || user.otp_code !== otp)
      return res.status(400).json({ message: "OTP salah atau tidak ada" });

    if (new Date() > new Date(user.otp_expired))
      return res.status(400).json({ message: "OTP kadaluarsa" });

    db.query("UPDATE users SET is_verified=1, otp_code=NULL, otp_expired=NULL WHERE email=?", [email], (e) => {
      if (e) {
        console.error("UPDATE ERROR:", e);
        return res.status(500).json({ message: "Database error" });
      }
      res.json({ message: "Verifikasi berhasil!" });
    });
  });
};

// LOGIN
export const login = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email=?", [email], (err, result) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (!result || result.length === 0)
      return res.status(404).json({ message: "Email tidak ditemukan" });

    const user = result[0];

    if (user.is_verified === 0)
      return res.status(403).json({ message: "Akun belum diverifikasi! Cek email." });

    bcrypt.compare(password, user.password, (err, match) => {
      if (err) {
        console.error("BCRYPT ERROR:", err);
        return res.status(500).json({ message: "Server error" });
      }
      if (!match) return res.status(400).json({ message: "Password salah" });

      res.json({
        message: "Login berhasil",
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    });
  });
};

export const forgotPassword = (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email wajib diisi" });

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (!result.length)
      return res.status(404).json({ message: "Email tidak ditemukan" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expired = new Date(Date.now() + 5 * 60 * 1000);

    db.query(
      "UPDATE users SET reset_otp=?, reset_expired=? WHERE email=?",
      [otp, expired, email]
    );

    await sendOTP(email, otp);

    res.json({ message: "Kode reset password telah dikirim ke email" });
  });
};

export const resetPassword = (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword)
    return res.status(400).json({ message: "Semua field wajib diisi" });

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (!result.length)
      return res.status(404).json({ message: "Email tidak ditemukan" });

    const user = result[0];

    if (user.reset_otp !== otp)
      return res.status(400).json({ message: "OTP salah" });

    if (new Date() > new Date(user.reset_expired))
      return res.status(400).json({ message: "OTP kadaluarsa" });

    const hashed = await bcrypt.hash(newPassword, 10);

    db.query(
      "UPDATE users SET password=?, reset_otp=NULL, reset_expired=NULL WHERE email=?",
      [hashed, email]
    );

    res.json({ message: "Password berhasil direset!" });
  });
};

