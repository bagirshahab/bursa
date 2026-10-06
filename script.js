/* =====================================================================
   Pramuka IPB — Pendataan Bursa Calon KDR (Frontend logic)
   ---------------------------------------------------------------------
   Setelah deploy project ini ke Vercel, ganti API_BASE dengan URL
   deployment-nya, mis: const API_BASE = "https://bursa-kdr-xxx.vercel.app/api";
   ===================================================================== */
const API_BASE = "https://GANTI-DENGAN-URL-VERCEL-BURSA.vercel.app/api";

const SUBMIT_URL = `${API_BASE}/submit`;

const MSG = {
  sending: "Mengirim...",
  btn_submit: "Kirim",
  err_required: "Mohon lengkapi semua isian wajib (bertanda *).",
  err_radio: "Mohon pilih angkatan.",
  err_connect: "Tidak dapat terhubung ke server. Silakan coba lagi.",
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bursa-form");
  const submitBtn = document.getElementById("submit-btn");
  const submitBtnText = document.getElementById("submit-btn-text");
  const messageBox = document.getElementById("form-message");

  const rate = document.getElementById("rate");
  const rateValue = document.getElementById("rate-value");

  const successModal = document.getElementById("success-modal");
  const successModalClose = document.getElementById("success-modal-close");

  // ---- Rate scale live value ----
  if (rate && rateValue) {
    rate.addEventListener("input", () => { rateValue.textContent = rate.value; });
  }

  // ---- Submit ----
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearMessage();

    const requiredText = ["eval_program", "eval_kinerja", "calon_stk", "calon_ipk", "alasan"];
    for (const name of requiredText) {
      const el = form.querySelector(`[name="${name}"]`);
      if (!el || !el.value.trim()) {
        showMessage(MSG.err_required, "error");
        el && el.focus();
        return;
      }
    }

    if (!form.querySelector('[name="angkatan"]:checked')) {
      showMessage(MSG.err_radio, "error");
      return;
    }

    const formData = new FormData(form);

    setLoading(true);
    try {
      const res = await fetch(SUBMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showMessage(data.error || "Terjadi kesalahan saat mengirim data.", "error");
        return;
      }
      form.reset();
      if (rateValue) rateValue.textContent = "5";
      openModal();
    } catch (err) {
      console.error(err);
      showMessage(MSG.err_connect, "error");
    } finally {
      setLoading(false);
    }
  });

  // ---- Modal ----
  function openModal() {
    if (!successModal) return;
    successModal.hidden = false;
    void successModal.offsetWidth;
    successModal.classList.add("visible");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    if (!successModal) return;
    successModal.classList.remove("visible");
    document.body.style.overflow = "";
    setTimeout(() => { successModal.hidden = true; }, 300);
  }
  if (successModalClose) successModalClose.addEventListener("click", closeModal);
  if (successModal) {
    const backdrop = successModal.querySelector(".success-modal-backdrop");
    if (backdrop) backdrop.addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !successModal.hidden) closeModal();
    });
  }

  // ---- Helpers ----
  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtnText.textContent = isLoading ? MSG.sending : MSG.btn_submit;
  }
  function showMessage(text, type) {
    messageBox.textContent = text;
    messageBox.className = "form-message " + type;
    messageBox.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  function clearMessage() {
    messageBox.textContent = "";
    messageBox.className = "form-message";
  }
});
