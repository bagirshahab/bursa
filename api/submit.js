import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

function setCorsHeaders(res) {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });

  try {
    let body = req.body;
    if (typeof body === "string") body = JSON.parse(body || "{}");
    if (!body) body = {};

    const evalProgram = (body.eval_program || "").trim();
    const evalKinerja = (body.eval_kinerja || "").trim();
    const rate = parseInt(body.rate || "0", 10);
    const calonStk = (body.calon_stk || "").trim();
    const calonIpk = (body.calon_ipk || "").trim();
    const angkatan = (body.angkatan || "").trim();
    const alasan = (body.alasan || "").trim();

    // ---- Validasi field wajib ----
    if (!evalProgram || !evalKinerja || !calonStk || !calonIpk || !angkatan || !alasan) {
      return res.status(400).json({ error: "Mohon lengkapi semua isian wajib." });
    }
    if (isNaN(rate) || rate < 1 || rate > 10) {
      return res.status(400).json({ error: "Rate kepuasan tidak valid." });
    }

    // ---- Simpan ke database ----
    await sql`
      INSERT INTO bursa_kdr
        (eval_program, eval_kinerja, rate, calon_stk, calon_ipk, angkatan, alasan, created_at)
      VALUES
        (${evalProgram}, ${evalKinerja}, ${rate}, ${calonStk}, ${calonIpk}, ${angkatan}, ${alasan}, NOW())
    `;

    return res.status(200).json({ success: true, message: "Data berhasil dikirim." });
  } catch (err) {
    console.error("bursa submit error:", err);
    return res.status(500).json({ error: "Terjadi kesalahan server. Silakan coba lagi." });
  }
}
