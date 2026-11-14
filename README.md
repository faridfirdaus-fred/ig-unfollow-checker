# Instagram Unfollow Checker 🔍

Tool aman, ringan, dan **100% berjalan di sisi klien (browser)** untuk mengetahui akun following yang tidak follow back (*follback*) akun Instagram Anda. Dilengkapi dengan antarmuka modern (*Dark Mode floating modal*), pencarian interaktif, fitur salin tautan, dan ekspor daftar ke file `.txt`.

---

## 🌟 Kenapa Tool Ini Aman?

- **Tanpa Password / Kredensial Pihak Ketiga**: Berjalan langsung menggunakan cookie sesi aktif di browser Anda (`ds_user_id` & `csrftoken`).
- **100% Client-Side**: Tidak ada data yang dikirim ke server pihak ketiga manapun.
- **Rate-Limiting Protection**: Memiliki jeda otomatis (*delay* 1 detik per 50 akun) agar akun aman dari pembatasan API Instagram.

---

## 🚀 3 Pilihan Penggunaan (Reusable)

Pilih metode yang paling nyaman bagi Anda:

### 1. Ekstensi Userscript (Paling Praktis & Otomatis) ⭐

Otomatis memunculkan tombol melayang **"🔍 Check Follback"** di pojok kanan bawah Instagram setiap Anda membuka web.

1. Pasang ekstensi **Tampermonkey** atau **Violentmonkey** di browser Anda (Chrome / Firefox / Edge / Brave).
2. Klik link instalasi langsung:  
   👉 [**Install ig-unfollow-checker.user.js**](https://raw.githubusercontent.com/faridfirdaus-fred/ig-unfollow-checker/main/ig-unfollow-checker.user.js)
3. Klik tombol **Install** di jendela Tampermonkey yang muncul.
4. Buka atau refresh halaman [instagram.com](https://www.instagram.com).
5. Klik tombol **"🔍 Check Follback"** di pojok kanan bawah!

---

### 2. Chrome / Firefox DevTools Snippets (Tanpa Ekstensi)

Simpan script permanen di browser tanpa memasang ekstensi apa pun:

1. Buka [instagram.com](https://www.instagram.com) dan buka DevTools (`F12` atau `Ctrl + Shift + I`).
2. Masuk ke tab **Sources** -> di panel sebelah kiri, pilih tab **Snippets** (jika tersembunyi, klik ikon panah ganda `>>` lalu pilih *Snippets*).
3. Klik **+ New snippet**, beri nama: `ig-checker`.
4. Salin seluruh isi kode dari file [`checker.js`](./checker.js) dan tempel ke editor snippet.
5. Tekan `Ctrl + Enter` (atau klik tombol Play `▶` di kanan bawah) untuk menjalankannya kapan pun Anda butuh.

---

### 3. Bookmarklet Browser (1 Klik di Bookmark Bar)

1. Buka Bookmark Manager browser (`Ctrl + Shift + O`).
2. Buat bookmark baru:
   - **Name**: `IG Check Follback`
   - **URL**: Buka file [`bookmarklet.txt`](./bookmarklet.txt), salin seluruh kodenya (dimulai dari `javascript:...`), lalu paste ke kolom URL bookmark.
3. Simpan. Kapan pun Anda membuka [instagram.com](https://www.instagram.com), cukup klik bookmark tersebut di bookmarks bar.

---

## 📸 Fitur Antarmuka

- **Ringkasan Statistik**: Menampilkan total Following, Followers, dan selisih akun yang tidak follback.
- **Live Search**: Kolom pencarian instan untuk memfilter daftar akun berdasarkan *username* atau *display name*.
- **Direct Profile Links**: Tautan langsung ke profil masing-masing pengguna.
- **Salin Semua Link**: Tombol 1-klik untuk menyalin seluruh link profil ke clipboard.
- **Unduh File TXT**: Mengunduh laporan hasil pemindaian lengkap dengan timestamp.

---

## ⚠️ Catatan Penting

- Pastikan Anda sudah login ke akun Instagram di tab browser tersebut sebelum menjalankan pemindaian.
- Jika akun Anda mengikuti ribuan orang (*high following count*), proses pemindaian akan memakan waktu beberapa menit karena jeda rate-limit demi keamanan akun Anda.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah lisensi [MIT](./LICENSE).
