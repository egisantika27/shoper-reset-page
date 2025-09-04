// app.js - Logika untuk halaman Update Kata Sandi

document.addEventListener('DOMContentLoaded', function() {
    
    // --- Inisialisasi Supabase Client HANYA DENGAN KUNCI PUBLIK ---
    const SUPABASE_URL = 'https://psstmdfdoantnlmicvcp.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzc3RtZGZkb2FudG5sbWljdmNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMjMwMzUsImV4cCI6MjA3MDg5OTAzNX0.YJTfXgGmbNdNoNa-77QZfZqbBUNJdZk-x7WGsFW6IJE';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const form = document.getElementById('update-password-form');
    const messageDiv = document.getElementById('message');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    let currentSession = null;

    // Dengarkan event perubahan otentikasi
    supabase.auth.onAuthStateChange((_event, session) => {
        // Ini akan terpicu saat halaman dimuat jika ada fragmen # di URL
        if (_event === 'PASSWORD_RECOVERY') {
            currentSession = session;
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        messageDiv.textContent = '';
        messageDiv.className = 'message';

        // Validasi input
        if (password !== confirmPassword) { /* ... validasi tidak cocok ... */ }
        if (!/^\d{6}$/.test(password)) { /* ... validasi PIN 6 angka ... */ }
        
        if (!currentSession) {
            messageDiv.textContent = 'Sesi tidak ditemukan. Silakan kembali ke email dan klik link reset lagi.';
            messageDiv.classList.add('error');
            return;
        }

        try {
            // [DIUBAH] Memanggil API backend kita, bukan Supabase langsung
            const response = await fetch('/api/update-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: password,
                    access_token: currentSession.access_token,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                // Jika server merespons dengan error
                throw new Error(result.error || 'Terjadi kesalahan.');
            }

            // Jika berhasil
            messageDiv.textContent = 'Kata sandi Anda berhasil diperbarui! Anda bisa menutup halaman ini.';
            messageDiv.classList.add('success');
            form.reset();

        } catch (error) {
            messageDiv.textContent = `Error: ${error.message}`;
            messageDiv.classList.add('error');
        }
    });
});