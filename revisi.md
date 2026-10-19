===========================================================
daftar revisi fungsional yang harus di perbaiki 
===========================================================

1. Hilangkan Akun demo ketika login

2. Perbaiki loading menggunakan loading sekeleton di setiap halaman daaripada hanya teks biasaa. Pastikan komponen loading sekeleton reuseable dan tetap sesuai deengan layout konten halamanya

3. Perbaiki header agar tidak terlalu banyak teks seperti mode demo, admin pusat, email dan logout. Perbaiki lagi agar dipersimple di dalam satu button profil yang akan menampilkan seemua informasi dasar dan CTA logout

4. halaman pendaftaran hilangkan 2 form pendaftaran murid & guru

5. Di halaman Manajemen Siswa. Di halaman ini adalah tempat admin melihat dan menganalisis siswa untuk keperluan bisnis. Untuk awalan tampilkan daftar data ini [Nama, Usia, Lokasi, Berlaku s/d, status (aktif/tidak), aksi/detail]. Jika detail di click maka akan muncul popup yang menampilkan keseluruhan daftar data siswa tersebut seperti foto profil dan nomor telpon. Perbaiki juga filter nya untuk fokus pada mengfilter murid berdasarkan lokasi, usia, status. Hilangkan tombol + tambah siswa beserta fungsinya. Dan terapkan debounce pada search input

6. Di halaman Jadwal & Sesi. Sistem inputan di sini masih sangat kaku kuran flexibel dan akan memakan waktu lama. Rombak input jadwal dan sesi ini agar flexibel dan terstruktur. Ketika ingin menambahkan jadwal / sesi di suatu lokasi kolam renang maka admin akan mendapatkan form seperti ini. 
    Form Penambahan Sesi
    1. Admin menginput nama contoh "Sesi 1"
    2. admin menambahkan mulai jam sesi, jam mulai berapa dan akan otomatis generate jam berikutnya h + 1jam secara otomatis
    3. lalu simpan sesi dan mengirim data ke database dengan endpoint /api/sessions

    Form Penambahan Jadwal
    1. Admin akan memilih 1 lokasi, admin akan memilih daftar lokasi yang sudah di daftarkan sebelumnya dan admin hanya mengclick 1 nama lokasi mana tanpa memasukan ID lokasi tersebut.
    2. disini akana sedikit menarik. Terdapat 7 kolom hari (senin - minggu) lalu ada total sesi yang sudah di generate, terdapat input check yang mengambil value dari hari dan sesi, jika di check di hari senin - sesi 1, sesi 2, sesi 3, maka terdapat 3 sesi di hari tersebut yang bisa diisi oleh guru/murid, selain baris sesi, berikan juga teks p deskripsi untuk memberi tahu kalo sesi tersebut di jam (09.00 - 10.00) agar admin tetap ingat.
    3. Tombol kirim data ke server.
Setelah itu, perbaiki lagi tampilan dari halaman jadwal & sesi agar tidak ada tampilan yang kosong, jika tidka ada laporan dari guru untuk mengubah jadwal maka tetap menampilkan card tanpa menampilkan data nya, dengan begitu dashboard tetap clean. Perbaiki juga filter, buat filter mengambil data real yang sudah terdaftar, Lokasi dan sesi.

7. Di halaman Lokasi kolam. Perbaiki lagi agar data yang ditampilkan lebih jelas mesikipun belum difilter. Langsung pisahkan setiap lokasi dengan header area lalu data dibawahnya akan menampilkan data [nama, category, mapUrl (berupa link bukan teks biasa), Edit & Hapus]. Sebagai contoh. 
Bintaro
    permata swemming pool, Kerjasama, https://www.permata.com, Edit Hapus.
    permata swemming pool, Kerjasama, https://www.permata.com, Edit Hapus.
Serpong
    permata swemming pool, Kerjasama, https://www.permata.com, Edit Hapus

8. Di halaman Harga & Paket. Buat lebih flexibel dengan menambahkan workflow inputan seperti ini.
    1. Admin akan memilih 1 dari daftar kolam renang. 
    2. Lalu tambahkan 4 kategori (Reguler, Privat, Atlit, "Beasiswa") ini dan masing" tambahkan inputan harga. 
Dengan ini admin bisa memasukan 1 lokasi kolam renang dan memasukan berbagai harga package secara Langsung.

9. Di halaman manajemen Pelatih. Perlakukan hal yang sama seperti manajemen siswa deengan penyesuaian datanya saja. Lihatt dokumentasi api agar bisa melihat data mana yang perlu di tampilkan di depan dan di tombol detail.

10. Di halaman pengelola terutama form input, jangan biarkan admin memasukan nama kolam / id kolam. Langsung tambahkan list kolam mana yang akan di daftarkan oleh pengelola tersebut

11. Halaman profil. Hapus fungsi ganti avatar.

12. Banyak sekali UI yang masih berantakan ketika dibuka di mobile / tablet. Perbaiki seluruh halaman agar responsive.

===========================================================
daftar revisi Non fungsional yang harus di perbaiki 
===========================================================
1. Kenapa setiap pindah tab browser atau pindah route browser selalu request data ke server dan dilakukan secara terus menerus hingga terkena rate limiter yang cukup besar. Migrasi semua query yang masih menggunakan library @tanstack/react-query atau yang bersangkutan dan gunakan fetch api biasa (bukan axios) untuk memanggil data apapun dari server. 

2. Perbaiki route agar tidak merefresh browser dan me request data ke server setiap kali berpindah halaman