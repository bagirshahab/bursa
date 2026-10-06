-- =====================================================================
--  DATABASE SCHEMA — Pendataan Bursa Calon KDR Pramuka IPB
--  Jalankan skrip ini di Neon SQL Editor (boleh di database yang sama
--  dengan form pendaftaran; tabelnya terpisah, tidak bentrok).
-- =====================================================================

CREATE TABLE IF NOT EXISTS bursa_kdr (
    id             BIGSERIAL PRIMARY KEY,

    -- Evaluasi
    eval_program   TEXT    NOT NULL,   -- pendapat tentang program/kegiatan racana 2024/2025
    eval_kinerja   TEXT    NOT NULL,   -- pendapat kinerja KDR Kabinet Arunika Cakra
    rate           INTEGER NOT NULL,   -- rate kepuasan 1-10

    -- Who's the next KDR
    calon_stk      TEXT    NOT NULL,   -- usulan KDR Surya Tirta Kencana (putra)
    calon_ipk      TEXT    NOT NULL,   -- usulan KDR Inggita Puspa Kirana (putri)
    angkatan       TEXT    NOT NULL,   -- "50" / "51"
    alasan         TEXT    NOT NULL,

    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bursa_kdr_created
    ON bursa_kdr (created_at DESC);

-- =====================================================================
--  Lihat hasil bursa:
--    SELECT calon_stk, calon_ipk, angkatan, rate, created_at
--    FROM bursa_kdr ORDER BY created_at DESC;
--
--  Rekap suara calon putra terbanyak:
--    SELECT calon_stk, COUNT(*) AS jumlah
--    FROM bursa_kdr GROUP BY calon_stk ORDER BY jumlah DESC;
--
--  Rekap suara calon putri terbanyak:
--    SELECT calon_ipk, COUNT(*) AS jumlah
--    FROM bursa_kdr GROUP BY calon_ipk ORDER BY jumlah DESC;
-- =====================================================================
