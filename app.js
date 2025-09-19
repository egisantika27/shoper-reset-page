 // --- Inisialisasi Supabase Client ---
  const SUPABASE_URL = "https://psstmdfdoantnlmicvcp.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzc3RtZGZkb2FudG5sbWljdmNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMjMwMzUsImV4cCI6MjA3MDg5OTAzNX0.YJTfXgGmbNdNoNa-77QZfZqbBUNJdZk-x7WGsFW6IJE";
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // --- Tangkap elemen DOM ---
  const form = document.getElementById("update-password-form");
  const messageDiv = document.getElementById("message");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");

  // --- Step 1: Proses token dari Supabase (hash fragment) ---
  document.addEventListener("DOMContentLoaded", async () => {
    const hash = window.location.hash;

    if (hash && hash.includes("access_token")) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(hash);

      if (error) {
        console.error("❌ Error exchange token:", error.message);
        messageDiv.textContent = "Link reset tidak valid atau sudah kedaluwarsa.";
        messageDiv.classList.add("error");
        return;
      }

      console.log("✅ Session restored:", data.session);
      // Bersihkan hash dari URL setelah diproses
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  });

  // --- Step 2: Handle submit form untuk update password ---
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    messageDiv.textContent = "";
    messageDiv.className = "message";

    // Validasi
    if (password !== confirmPassword) {
      messageDiv.textContent = "Kata sandi tidak cocok. Silakan coba lagi.";
      messageDiv.classList.add("error");
      return;
    }

    if (!/^\d{6}$/.test(password)) {
      messageDiv.textContent = "Kata sandi harus terdiri dari 6 digit angka.";
      messageDiv.classList.add("error");
      return;
    }

    // Update password di Supabase
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      console.error("❌ Error update password:", error.message);
      messageDiv.textContent = `Error: ${error.message}`;
      messageDiv.classList.add("error");
    } else {
      messageDiv.textContent = "✅ Kata sandi berhasil diperbarui! Silakan login dengan kata sandi terbaru.";
      messageDiv.classList.add("success");
      form.reset();
    }
  });
