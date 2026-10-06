# Pendataan Bursa Calon KDR — UKM Pramuka IPB

Form pendataan/usulan **Bursa Calon Ketua Dewan Racana** (Surya Tirta Kencana & Inggita Puspa Kirana) periode 2025/2026. Dibuat sebagai **project Vercel terpisah** dari form pendaftaran calon ketua.

Isi form (mengikuti Google Form asli):
- Evaluasi program/kegiatan racana 2024/2025
- Evaluasi kinerja KDR Kabinet Arunika Cakra
- Rate kepuasan KDR 2024/2025 (skala 1-10)
- Usulan calon KDR Surya Tirta Kencana (putra)
- Usulan calon KDR Inggita Puspa Kirana (putri)
- Angkatan (50 / 51)
- Alasan
- Pop-up "Terima Kasih" setelah kirim

---

## Struktur File

```
bursa-kdr/
├── index.html        # Halaman form
├── style.css         # Tampilan (tema Pramuka IPB)
├── script.js         # Logika form ← ADA 1 BARIS API_BASE YANG WAJIB DIGANTI
├── schema.sql        # Skrip pembuatan tabel bursa_kdr
├── package.json
├── vercel.json
├── .env.example
├── .gitignore
└── api/
    └── submit.js     # Simpan data ke database
```

---

## LANGKAH DEPLOY (Opsi A — project Vercel terpisah)

### 1. Buat tabel di Neon
Pakai **database Neon yang sama** dengan form pendaftaran (tabelnya terpisah, tidak bentrok).
1. Neon → **SQL Editor**.
2. Salin seluruh isi `schema.sql`, tempel, **Run**. Ini membuat tabel `bursa_kdr`.

### 2. Upload ke GitHub (repo BARU)
Buat repository baru, mis. `bursa-kdr-pramukaipb`, lalu upload **isi folder `bursa-kdr`** (termasuk folder `api/`). Cara mudah: **Add file → Upload files** di GitHub.

### 3. Deploy ke Vercel (project BARU)
1. Vercel → **Add New… → Project** → import repo `bursa-kdr-pramukaipb`.
2. Tambahkan **Environment Variables**:

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | string Neon (boleh sama persis dengan form pendaftaran, tanpa `&channel_binding=require`) |
   | `ALLOWED_ORIGIN` | `*` dulu saat testing |

3. Klik **Deploy**. Catat URL yang diberikan, mis. `https://bursa-kdr-pramukaipb.vercel.app`.
   > Inilah "subdomain Vercel" tersendiri untuk form bursa, terpisah dari form pendaftaran.

### 4. Sambungkan frontend ke API
1. Buka `script.js`, baris atas:
   ```js
   const API_BASE = "https://GANTI-DENGAN-URL-VERCEL-BURSA.vercel.app/api";
   ```
2. Ganti dengan URL Vercel bursa + `/api`, contoh:
   ```js
   const API_BASE = "https://bursa-kdr-pramukaipb.vercel.app/api";
   ```
3. Simpan → commit/upload ulang ke GitHub → Vercel auto re-deploy.

### 5. (Setelah tes berhasil) Amankan CORS
Ubah `ALLOWED_ORIGIN` di Vercel dari `*` menjadi domain form bursa, lalu **Redeploy**.

---

## Melihat Hasil Bursa

Di Neon → SQL Editor:

```sql
-- Semua masukan
SELECT calon_stk, calon_ipk, angkatan, rate, created_at
FROM bursa_kdr ORDER BY created_at DESC;

-- Rekap suara calon putra terbanyak
SELECT calon_stk, COUNT(*) AS jumlah
FROM bursa_kdr GROUP BY calon_stk ORDER BY jumlah DESC;

-- Rekap suara calon putri terbanyak
SELECT calon_ipk, COUNT(*) AS jumlah
FROM bursa_kdr GROUP BY calon_ipk ORDER BY jumlah DESC;
```

---

## Catatan
- Form ini **tidak pakai verifikasi email/OTP** dan **tidak kirim email** — hanya menyimpan data ke database, sesuai sifat form bursa/usulan.
- Satu-satunya baris kode yang perlu kamu edit: `API_BASE` di `script.js`.
- Teks pop-up, kontak narahubung, dan field bisa disesuaikan di `index.html`.

Salam Pramuka — **# AmbilPeran** 🌴
