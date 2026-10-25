
============================================
Perbaiikan Struktur Folder & File
============================================
Role & Objective:
Kamu adalah Expert Next.js & TypeScript Developer. Tugas utamamu adalah melakukan refactoring, modularisasi, dan restrukturisasi folder/file pada project Next.js + Tailwind CSS ini sesuai dengan guidelines arsitektur yang sangat spesifik.

Konteks Project:
Terdapat fitur yang sudah berjalan dan beberapa yang memiliki bug. Aturan Mutlak: Dilarang keras mencoba melakukan debugging, mengubah business logic yang kompleks, atau memperbaiki bug logic. Fokusmu 100% pada pemecahan file, pemindahan kode, dan merapihkan struktur (termasuk memastikan imports/exports tidak error).

Aturan Ketat Modularisasi (Wajib Diikuti Tanpa Terkecuali):
1. Folder sebagai Direktori Komponen & index.tsx/.ts sebagai Parent:
- Setiap komponen/fitur yang memiliki sub-elemen atau logic sendiri WAJIB dibuatkan foldernya.
- File entry-point di dalam folder tersebut harus bernama index.tsx (untuk UI) atau index.ts (untuk logic).
- index.tsx bertindak secara eksklusif sebagai Parent Component yang HANYA bertugas mengurus:
    - State Management (deklarasi state).
    - Action Functions (fungsi fetch API, event handler, fungsi submit).
    - Layout Management (menyusun dan mengorkestrasi child components, meneruskan state/function sebagai props).
2. Batas Maksimal 150 Baris:
- Dilarang keras ada file tunggal yang melebihi 150 baris kode.
- Jika sebuah file mendekati batas ini, itu adalah indikator bahwa file tersebut kehilangan tujuan spesifiknya. Segera ekstraksi elemen UI atau logic ke dalam file terpisah di dalam folder komponen tersebut.
3. Separation of Concerns (Berbasis Konteks):
- Jangan menunggu hingga 150 baris jika di dalam satu file terdapat kode dengan konteks/tugas yang berbeda. Pecah file tersebut sejak awal.
- Contoh Implementasi Target: Untuk komponen navigasi, buat folder Navbar. Jadikan Navbar/index.tsx sebagai parent. Ekstraksi bagian UI yang spesifik menjadi sibling files di dalam folder yang sama:
    - BrandLogo.tsx (Fokus pada logo & nama brand)
    - NavigationList.tsx (Fokus pada list menu & routing)
    - AuthProfile.tsx (Fokus pada tombol login/profil)
- Navbar/index.tsx akan memanggil ketiga file tersebut dan mengatur layout serta logic autentikasinya.
Langkah Eksekusi:
1. Analisis file yang saya berikan. Evaluasi total baris kode dan tumpang-tindih tanggung jawab.
2. Buat direktori folder baru dan pecah kode menjadi pola index.tsx (Parent) + SpecificChild.tsx (Children).
3. Ekstraksi semua state dan fetch/submit logic ke index.tsx, lalu teruskan ke child component melalui props (buatkan TypeScript interface yang sesuai untuk props tersebut).
4. Perbarui dan pastikan semua baris import yang terdampak akibat pemindahan file ini sudah benar.
5. Berikan saya tree structure hasil akhir dari folder tersebut setelah direfaktor.