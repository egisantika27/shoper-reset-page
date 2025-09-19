document.addEventListener('DOMContentLoaded', async function () {
  // --- Inisialisasi Supabase Client ---
  const SUPABASE_URL = 'https://psstmdfdoantnlmicvcp.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzc3RtZGZkb2FudG5sbWljdmNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMjMwMzUsImV4cCI6MjA3MDg5OTAzNX0.YJTfXgGmbNdNoNa-77QZfZqbBUNJdZk-x7WGsFW6IJE';
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // --- Elemen DOM ---
  const form = document.getElementById('update-password-form');
  const messageDiv = document.getElementById('message');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');

  // --- Step 1: Cek apakah ini link recovery dari email ---
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    const hashParams = window.location.hash.substring(1); // ambil bagian setelah '#'
    const queryParams = new URLSearchParams(hashParams);

    if (queryParams.get('type') === 'recovery') {
      // Set session dengan token dari Supabase
      const { error } = await supabase.auth.setSession({
        access_token: queryParams.get('access_token'),
        refresh_token: queryParams.get('refresh_token'),
      });

      if (error) {
        messageDiv.textContent = `Gagal memvalidasi token reset: ${error.message}`;
        messageDiv.classList.add('error');
        return;
      }
    } else {
      messageDiv.textContent = 'Token reset tidak ditemukan. Silakan cek ulang tautan email Anda.';
      messageDiv.classList.add('error');
      return;
    }
  }

  // --- Step 2: Submit form update password ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Reset pesan
    messageDiv.textContent = '';
    messageDiv.className = 'message';

    // --- Validasi input ---
    if (password !== confirmPassword) {
      messageDiv.textContent = 'Kata sandi tidak cocok. Silakan coba lagi.';
      messageDiv.classList.add('error');
      return;
    }

    if (!/^\d{6}$/.test(password)) {
      messageDiv.textContent = 'Kata sandi harus terdiri dari 6 digit angka.';
      messageDiv.classList.add('error');
      return;
    }

    // --- Update password ---
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      messageDiv.textContent = `Error: ${error.message}`;
      messageDiv.classList.add('error');
    } else {
      messageDiv.textContent = '✅ Kata sandi berhasil diperbarui! Silakan login dengan kata sandi baru.';
      messageDiv.classList.add('success');
      form.reset();
    }
  });
});
