// /api/update-password.js

import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase client MENGGUNAKAN SERVICE ROLE KEY
// Kunci ini akan kita ambil dari Environment Variables di Vercel
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Hanya izinkan metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { password, access_token } = req.body;

    if (!password || !access_token) {
      return res.status(400).json({ error: 'Password dan access token dibutuhkan.' });
    }

    // Verifikasi user menggunakan access_token yang dikirim dari client
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(access_token);

    if (userError || !user) {
        return res.status(401).json({ error: 'Sesi tidak valid atau kedaluwarsa.' });
    }

    // Jika user valid, update passwordnya menggunakan hak akses admin
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        { password: password }
    );

    if (updateError) {
        // Lemparkan error agar ditangkap oleh blok catch
        throw new Error(updateError.message);
    }

    // Kirim respons sukses
    res.status(200).json({ message: 'Kata sandi berhasil diperbarui!' });

  } catch (error) {
    // Kirim respons error
    res.status(500).json({ error: error.message });
  }
}