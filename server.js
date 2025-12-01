import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import db from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import giziRoutes from "./routes/giziRoutes.js";


// Fix __dirname (karena ESM tidak punya fitur ini)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Cek koneksi MySQL
db.getConnection((err, conn) => {
  if (err) {
    console.log("MySQL Error:", err);
  } else {
    console.log("MySQL Connected");
    conn.release();
  }
});


// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/gizi", giziRoutes);

// STATIC FILE (public)
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// START SERVER
app.listen(3000, () => console.log("Server running on port 3000"));
