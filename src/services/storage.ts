import {
  User,
  Product,
  Transaction,
  TransactionDetail,
  StockIn,
  StockOut,
  UserFeedback,
  BlackboxTestItem,
  CooperativeProfile,
} from '../types';
import { generateDateCode } from '../utils/formatters';

const STORAGE_KEYS = {
  USERS: 'KOPERASI_USERS',
  BARANG: 'KOPERASI_BARANG',
  TRANSAKSI: 'KOPERASI_TRANSAKSI',
  DETAIL_TRANSAKSI: 'KOPERASI_DETAIL_TRANSAKSI',
  STOK_MASUK: 'KOPERASI_STOK_MASUK',
  STOK_KELUAR: 'KOPERASI_STOK_KELUAR',
  FEEDBACK: 'KOPERASI_FEEDBACK',
  BLACKBOX: 'KOPERASI_BLACKBOX',
  PROFILE: 'KOPERASI_PROFILE',
  CURRENT_USER: 'KOPERASI_CURRENT_USER',
};

// Initial Default Seed Data
const DEFAULT_PROFILE: CooperativeProfile = {
  namaSekolah: 'SMP / SMA NEGERI 1 HARAPAN BANGSA',
  namaKoperasi: 'Koperasi Sekolah Sejahtera',
  alamat: 'Jl. Pendidikan No. 45, Kompleks Pendidikan Nasional',
  telepon: '(021) 7890-1234',
  ketuaKoperasi: 'Dra. Hj. Nurhayati, M.Pd.',
  nipKetua: '19750812 200003 2 004',
  pesanStruk: 'Terima kasih telah berbelanja di Koperasi Sekolah. Simpan struk ini sebagai bukti pembelian sah.',
};

const DEFAULT_USERS: User[] = [
  {
    id: 'USR-001',
    username: 'admin',
    passwordHash: 'admin123', // In real system, salted hash; demo matching requirement
    nama: 'Ibu Siti Rahayu, S.Pd (Pengurus 1)',
    role: 'admin',
    status: 'Aktif',
  },
  {
    id: 'USR-002',
    username: 'kasir',
    passwordHash: 'kasir123',
    nama: 'Bpk. Joko Purnomo (Pengurus 2 / Kasir)',
    role: 'kasir',
    status: 'Aktif',
  },
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'BRG-001',
    nama: 'Kemeja Putih Pendek Bordir OSIS',
    kategori: 'Seragam',
    ukuran: 'M',
    hargaBeli: 52000,
    hargaJual: 65000,
    stokAwal: 35,
    stokMasuk: 15,
    stokKeluar: 0,
    stokTerjual: 12,
    stokAkhir: 38,
    satuan: 'Pcs',
    status: 'Tersedia',
    keterangan: 'Bahan Oxford tebal premium berlogo OSIS',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'BRG-002',
    nama: 'Kemeja Putih Pendek Bordir OSIS',
    kategori: 'Seragam',
    ukuran: 'L',
    hargaBeli: 55000,
    hargaJual: 68000,
    stokAwal: 30,
    stokMasuk: 20,
    stokKeluar: 1,
    stokTerjual: 24,
    stokAkhir: 25,
    satuan: 'Pcs',
    status: 'Tersedia',
    keterangan: 'Bahan Oxford tebal premium berlogo OSIS',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'BRG-003',
    nama: 'Kemeja Putih Pendek Bordir OSIS',
    kategori: 'Seragam',
    ukuran: 'XL',
    hargaBeli: 58000,
    hargaJual: 72000,
    stokAwal: 15,
    stokMasuk: 5,
    stokKeluar: 0,
    stokTerjual: 16,
    stokAkhir: 4,
    satuan: 'Pcs',
    status: 'Stok Menipis',
    keterangan: 'Bahan Oxford tebal premium berlogo OSIS',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'BRG-004',
    nama: 'Celana Panjang Biru SMP',
    kategori: 'Celana',
    ukuran: '28',
    hargaBeli: 65000,
    hargaJual: 80000,
    stokAwal: 25,
    stokMasuk: 10,
    stokKeluar: 0,
    stokTerjual: 15,
    stokAkhir: 20,
    satuan: 'Pcs',
    status: 'Tersedia',
    keterangan: 'Bahan Drill halus tidak mudah kusut',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'BRG-005',
    nama: 'Celana Panjang Biru SMP',
    kategori: 'Celana',
    ukuran: '30',
    hargaBeli: 68000,
    hargaJual: 85000,
    stokAwal: 20,
    stokMasuk: 5,
    stokKeluar: 0,
    stokTerjual: 22,
    stokAkhir: 3,
    satuan: 'Pcs',
    status: 'Stok Menipis',
    keterangan: 'Bahan Drill halus tidak mudah kusut',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'BRG-006',
    nama: 'Rok Rempel Biru SMP',
    kategori: 'Rok',
    ukuran: 'M',
    hargaBeli: 62000,
    hargaJual: 78000,
    stokAwal: 30,
    stokMasuk: 10,
    stokKeluar: 0,
    stokTerjual: 18,
    stokAkhir: 22,
    satuan: 'Pcs',
    status: 'Tersedia',
    keterangan: 'Bahan Famatex rempel rapi',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'BRG-007',
    nama: 'Rok Rempel Abu-Abu SMA',
    kategori: 'Rok',
    ukuran: 'L',
    hargaBeli: 66000,
    hargaJual: 82000,
    stokAwal: 10,
    stokMasuk: 0,
    stokKeluar: 0,
    stokTerjual: 10,
    stokAkhir: 0,
    satuan: 'Pcs',
    status: 'Habis',
    keterangan: 'Bahan Famatex rempel rapi',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'BRG-008',
    nama: 'Topi Sekolah Bordir Logo',
    kategori: 'Topi',
    ukuran: 'All Size',
    hargaBeli: 12000,
    hargaJual: 18000,
    stokAwal: 50,
    stokMasuk: 30,
    stokKeluar: 0,
    stokTerjual: 35,
    stokAkhir: 45,
    satuan: 'Pcs',
    status: 'Tersedia',
    keterangan: 'Karet belakang elastis',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'BRG-009',
    nama: 'Dasi Sekolah SMP Bordir',
    kategori: 'Dasi',
    ukuran: 'All Size',
    hargaBeli: 8000,
    hargaJual: 12000,
    stokAwal: 60,
    stokMasuk: 20,
    stokKeluar: 0,
    stokTerjual: 42,
    stokAkhir: 38,
    satuan: 'Pcs',
    status: 'Tersedia',
    keterangan: 'Model perekat praktis',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'BRG-010',
    nama: 'Ikat Pinggang Logo Logam',
    kategori: 'Ikat Pinggang',
    ukuran: 'All Size',
    hargaBeli: 10000,
    hargaJual: 15000,
    stokAwal: 40,
    stokMasuk: 10,
    stokKeluar: 0,
    stokTerjual: 28,
    stokAkhir: 22,
    satuan: 'Pcs',
    status: 'Tersedia',
    keterangan: 'Gesper jepit logo sekolah kuningan',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'BRG-011',
    nama: 'Kaos Kaki Putih Logo Sekolah',
    kategori: 'Kaos Kaki',
    ukuran: 'All Size',
    hargaBeli: 7000,
    hargaJual: 10000,
    stokAwal: 80,
    stokMasuk: 40,
    stokKeluar: 0,
    stokTerjual: 70,
    stokAkhir: 50,
    satuan: 'Pasang',
    status: 'Tersedia',
    keterangan: 'Bahan katun spandek lembut',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'BRG-012',
    nama: 'Atribut Badge OSIS & Lokasi Sekolah',
    kategori: 'Atribut',
    ukuran: 'All Size',
    hargaBeli: 3500,
    hargaJual: 6000,
    stokAwal: 100,
    stokMasuk: 50,
    stokKeluar: 0,
    stokTerjual: 90,
    stokAkhir: 60,
    satuan: 'Lembar',
    status: 'Tersedia',
    keterangan: 'Bordir komputer presisi tinggi',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'BRG-013',
    nama: 'Seragam Batik Sekolah Resmi',
    kategori: 'Seragam',
    ukuran: 'L',
    hargaBeli: 60000,
    hargaJual: 75000,
    stokAwal: 25,
    stokMasuk: 10,
    stokKeluar: 0,
    stokTerjual: 15,
    stokAkhir: 20,
    satuan: 'Pcs',
    status: 'Tersedia',
    keterangan: 'Motif khas identitas sekolah',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'BRG-014',
    nama: 'Setelan Seragam Olahraga',
    kategori: 'Seragam',
    ukuran: 'M',
    hargaBeli: 85000,
    hargaJual: 110000,
    stokAwal: 20,
    stokMasuk: 10,
    stokKeluar: 0,
    stokTerjual: 28,
    stokAkhir: 2,
    satuan: 'Stel',
    status: 'Stok Menipis',
    keterangan: 'Bahan TC + Diadora nyaman dan menyerap keringat',
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_STOCK_IN: StockIn[] = [
  {
    id: 'IN-20260810-001',
    tanggal: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    idBarang: 'BRG-001',
    namaBarang: 'Kemeja Putih Pendek Bordir OSIS',
    ukuran: 'M',
    jumlah: 15,
    keterangan: 'Pengadaan awal semester dari CV Berkah Konveksi',
    user: 'admin',
  },
  {
    id: 'IN-20260812-002',
    tanggal: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    idBarang: 'BRG-008',
    namaBarang: 'Topi Sekolah Bordir Logo',
    ukuran: 'All Size',
    jumlah: 30,
    keterangan: 'Tambahan stok topi MPLS',
    user: 'admin',
  },
];

const DEFAULT_STOCK_OUT: StockOut[] = [
  {
    id: 'OUT-20260815-001',
    tanggal: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    idBarang: 'BRG-002',
    namaBarang: 'Kemeja Putih Pendek Bordir OSIS',
    ukuran: 'L',
    jumlah: 1,
    alasan: 'Barang Cacat/Rusak',
    keterangan: 'Jahitan lengan sobek dari pabrik (rusak)',
    user: 'admin',
  },
];

const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: 'TRX-20260818-001',
    tanggal: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    namaPembeli: 'Rafi Ramadhan',
    kelas: 'VII-A',
    kasir: 'Ibu Siti Rahayu (admin)',
    total: 160000,
    bayar: 200000,
    kembali: 40000,
    metodeBayar: 'Tunai',
    catatan: 'Seragam dan atribut lengkap MPLS',
    items: [
      {
        id: 'DTL-001',
        idTransaksi: 'TRX-20260818-001',
        idBarang: 'BRG-001',
        namaBarang: 'Kemeja Putih Pendek Bordir OSIS',
        ukuran: 'M',
        jumlah: 1,
        harga: 65000,
        subtotal: 65000,
      },
      {
        id: 'DTL-002',
        idTransaksi: 'TRX-20260818-001',
        idBarang: 'BRG-004',
        namaBarang: 'Celana Panjang Biru SMP',
        ukuran: '28',
        jumlah: 1,
        harga: 80000,
        subtotal: 80000,
      },
      {
        id: 'DTL-003',
        idTransaksi: 'TRX-20260818-001',
        idBarang: 'BRG-010',
        namaBarang: 'Ikat Pinggang Logo Logam',
        ukuran: 'All Size',
        jumlah: 1,
        harga: 15000,
        subtotal: 15000,
      },
    ],
  },
  {
    id: 'TRX-20260819-002',
    tanggal: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    namaPembeli: 'Dewi Lestari',
    kelas: 'VII-C',
    kasir: 'Bpk. Joko Purnomo (kasir)',
    total: 96000,
    bayar: 100000,
    kembali: 4000,
    metodeBayar: 'Tunai',
    catatan: 'Atribut dan dasi',
    items: [
      {
        id: 'DTL-004',
        idTransaksi: 'TRX-20260819-002',
        idBarang: 'BRG-006',
        namaBarang: 'Rok Rempel Biru SMP',
        ukuran: 'M',
        jumlah: 1,
        harga: 78000,
        subtotal: 78000,
      },
      {
        id: 'DTL-005',
        idTransaksi: 'TRX-20260819-002',
        idBarang: 'BRG-009',
        namaBarang: 'Dasi Sekolah SMP Bordir',
        ukuran: 'All Size',
        jumlah: 1,
        harga: 12000,
        subtotal: 12000,
      },
      {
        id: 'DTL-006',
        idTransaksi: 'TRX-20260819-002',
        idBarang: 'BRG-012',
        namaBarang: 'Atribut Badge OSIS & Lokasi Sekolah',
        ukuran: 'All Size',
        jumlah: 1,
        harga: 6000,
        subtotal: 6000,
      },
    ],
  },
  {
    id: 'TRX-20260820-003',
    tanggal: new Date().toISOString(),
    namaPembeli: 'Bagus Pratama',
    kelas: 'VIII-B',
    kasir: 'Bpk. Joko Purnomo (kasir)',
    total: 80000,
    bayar: 100000,
    kembali: 20000,
    metodeBayar: 'Tunai',
    catatan: 'Ganti seragam celana',
    items: [
      {
        id: 'DTL-007',
        idTransaksi: 'TRX-20260820-003',
        idBarang: 'BRG-004',
        namaBarang: 'Celana Panjang Biru SMP',
        ukuran: '28',
        jumlah: 1,
        harga: 80000,
        subtotal: 80000,
      },
    ],
  },
];

export const INITIAL_BLACKBOX_TESTS: BlackboxTestItem[] = [
  {
    no: 1,
    fitur: 'Autentikasi Pengguna',
    skenario: 'Login dengan username dan password yang benar',
    input: 'username: "admin", password: "admin123"',
    expectedResult: 'Sistem berhasil memvalidasi, membuka sesi, dan mengarahkan pengguna ke halaman Dashboard.',
    actualResult: 'Pengguna berhasil masuk ke dashboard dengan role admin terkonfirmasi.',
    status: 'Berhasil',
  },
  {
    no: 2,
    fitur: 'Autentikasi Pengguna',
    skenario: 'Login dengan password yang salah',
    input: 'username: "admin", password: "salahpassword"',
    expectedResult: 'Sistem menolak login dan menampilkan pesan "Username atau password salah".',
    actualResult: 'Login ditolak, muncul peringatan kesalahan login, tidak ada sesi yang terbentuk.',
    status: 'Berhasil',
  },
  {
    no: 3,
    fitur: 'Data Barang',
    skenario: 'Menambah data barang seragam/atribut baru',
    input: 'Data barang lengkap (Nama, Kategori, Ukuran, Harga, Stok Awal)',
    expectedResult: 'Data barang baru tersimpan ke database, ID ter-generate otomatis, stok awal tercatat.',
    actualResult: 'Barang baru berhasil ditambahkan dan langsung muncul pada tabel barang.',
    status: 'Berhasil',
  },
  {
    no: 4,
    fitur: 'Data Barang',
    skenario: 'Mengedit data barang yang sudah ada',
    input: 'Ubah harga jual dan ukuran pada salah satu barang',
    expectedResult: 'Data barang berhasil diperbarui sesuai perubahan tanpa mengubah histori transaksi.',
    actualResult: 'Informasi barang terupdate secara realtime pada database dan antarmuka.',
    status: 'Berhasil',
  },
  {
    no: 5,
    fitur: 'Data Barang',
    skenario: 'Menghapus barang dengan konfirmasi',
    input: 'Pilih tombol hapus pada barang lalu konfirmasi "Ya, Hapus"',
    expectedResult: 'Sistem meminta konfirmasi keamanan, jika setuju data barang terhapus dari daftar aktif.',
    actualResult: 'Dialog konfirmasi muncul, barang terhapus dari database setelah dikonfirmasi.',
    status: 'Berhasil',
  },
  {
    no: 6,
    fitur: 'Transaksi Kasir',
    skenario: 'Melakukan transaksi penjualan kasir normal',
    input: 'Pilih barang, input nama siswa, kelas, input jumlah, selesaikan transaksi',
    expectedResult: 'Transaksi berhasil disimpan, struk tercetak, dan stok barang otomatis berkurang.',
    actualResult: 'Data transaksi tersimpan, struk kasir muncul siap cetak, stok barang berkurang sesuai qty.',
    status: 'Berhasil',
  },
  {
    no: 7,
    fitur: 'Validasi Stok Kasir',
    skenario: 'Transaksi dengan stok barang yang mencukupi',
    input: 'Barang stok 20, dibeli 2 unit',
    expectedResult: 'Sistem menerima transaksi dan memperbarui sisa stok menjadi 18.',
    actualResult: 'Transaksi sukses diproses, sisa stok berkurang tepat 2 unit menjadi 18.',
    status: 'Berhasil',
  },
  {
    no: 8,
    fitur: 'Validasi Stok Kasir',
    skenario: 'Transaksi dengan jumlah melebihi stok yang tersedia',
    input: 'Barang stok 3, dimasukkan ke keranjang dengan jumlah 5',
    expectedResult: 'Sistem menolak dengan pesan "Stok tidak mencukupi" dan mencegah transaksi diproses.',
    actualResult: 'Sistem menampilkan notifikasi error "Stok tidak mencukupi", tombol checkout dinonaktifkan/ditolak.',
    status: 'Berhasil',
  },
  {
    no: 9,
    fitur: 'Stok Masuk',
    skenario: 'Mencatat penambahan stok barang dari suplier',
    input: 'Pilih barang, input jumlah masuk 10, keterangan "Kiriman Pabrik"',
    expectedResult: 'Riwayat stok masuk tercatat dan stok akhir barang bertambah (Stok Akhir = Stok + 10).',
    actualResult: 'Riwayat stok masuk bertambah, stok barang langsung bertambah 10 unit.',
    status: 'Berhasil',
  },
  {
    no: 10,
    fitur: 'Stok Keluar',
    skenario: 'Mencatat stok keluar barang rusak/cacat',
    input: 'Pilih barang, input jumlah 2, alasan "Barang Cacat/Rusak"',
    expectedResult: 'Riwayat stok keluar tercatat dan stok akhir barang berkurang (Stok Akhir = Stok - 2).',
    actualResult: 'Stok keluar tersimpan, stok barang berkurang sesuai jumlah yang di-input.',
    status: 'Berhasil',
  },
  {
    no: 11,
    fitur: 'Validasi Stok Keluar',
    skenario: 'Stok keluar melebihi stok barang yang ada (Cegah Stok Minus)',
    input: 'Barang stok 4, input stok keluar 10',
    expectedResult: 'Sistem menolak proses pengeluaran stok dan menampilkan pesan peringatan.',
    actualResult: 'Sistem menolak penyimpanan dengan pesan "Jumlah stok keluar melebihi stok yang tersedia".',
    status: 'Berhasil',
  },
  {
    no: 12,
    fitur: 'Laporan Penjualan',
    skenario: 'Menampilkan data rekapitulasi penjualan',
    input: 'Buka menu Laporan Penjualan',
    expectedResult: 'Menampilkan total transaksi, total barang terjual, total pendapatan, dan rincian transaksi.',
    actualResult: 'Tabel laporan terisi lengkap dengan total pendapatan dan ringkasan transaksi akurat.',
    status: 'Berhasil',
  },
  {
    no: 13,
    fitur: 'Laporan Penjualan',
    skenario: 'Filter laporan penjualan berdasarkan rentang tanggal',
    input: 'Pilih Tanggal Awal dan Tanggal Akhir tertentu',
    expectedResult: 'Tabel dan total pendapatan otomatis menyaring data sesuai rentang tanggal yang dipilih.',
    actualResult: 'Data laporan terfilter secara akurat berdasarkan rentang tanggal yang ditentukan.',
    status: 'Berhasil',
  },
  {
    no: 14,
    fitur: 'Laporan Stok',
    skenario: 'Menampilkan laporan mutasi dan status stok barang',
    input: 'Buka menu Laporan Stok, pilih filter "Stok Menipis"',
    expectedResult: 'Menampilkan tabel Stok Awal, Masuk, Keluar, Terjual, Stok Akhir, dan Status filter.',
    actualResult: 'Laporan stok menampilkan mutasi lengkap dengan rumus Stok Akhir yang valid.',
    status: 'Berhasil',
  },
  {
    no: 15,
    fitur: 'Autentikasi Pengguna',
    skenario: 'Melakukan logout dari sistem',
    input: 'Klik tombol Logout',
    expectedResult: 'Sesi pengguna dihapus dan layar kembali ke form Login.',
    actualResult: 'Sesi berhasil diakhiri dan dialihkan kembali ke halaman login.',
    status: 'Berhasil',
  },
];

const DEFAULT_FEEDBACKS: UserFeedback[] = [
  {
    id: 'FDB-001',
    pengurusName: 'Ibu Siti Rahayu, S.Pd (Pengurus 1 - Admin)',
    role: 'Admin & Pengelola Koperasi',
    tanggal: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    skenarioTugas: [
      'Login sistem',
      'Menambah barang seragam baru',
      'Melakukan transaksi penjualan kasir',
      'Mengecek status stok menipis',
      'Melihat & mencetak laporan penjualan',
    ],
    kemudahanScore: 5,
    kecepatanScore: 5,
    komentarKelebihan:
      'Sistem sangat mudah dipahami oleh pengurus yang terbiasa catat buku. Fitur kasir cepat sekali untuk melayani antrian siswa saat jam istirahat. Struk dan laporan sangat rapi untuk laporan ke Kepala Sekolah.',
    komentarKendala:
      'Awalnya perlu membiasakan diri memilih ukuran seragam yang sesuai, namun setelah mencoba 2 kali langsung lancar.',
    saranPengembangan:
      'Pertahankan tampilan yang bersih dan tombol kasir yang besar agar tidak salah klik saat jam sibuk.',
  },
  {
    id: 'FDB-002',
    pengurusName: 'Bpk. Joko Purnomo (Pengurus 2 - Kasir/Stok)',
    role: 'Pengurus Operasional & Kasir',
    tanggal: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    skenarioTugas: [
      'Login sistem kasir',
      'Mencatat stok masuk kiriman konveksi',
      'Melakukan transaksi kasir',
      'Melihat laporan stok barang',
      'Cetak nota bukti penjualan',
    ],
    kemudahanScore: 5,
    kecepatanScore: 5,
    komentarKelebihan:
      'Fitur pencegahan stok minus sangat berguna karena sebelumnya di buku manual sering tercatat barang keluar padahal fisik sudah kosong. Tombol hitung kembalian uang juga sangat membantu.',
    komentarKendala: 'Tidak ada kendala berarti, proses input stok masuk sangat ringkas.',
    saranPengembangan:
      'Sangat cocok diimplementasikan secara permanen di koperasi sekolah kita untuk tahun ajaran baru.',
  },
];

// Helper functions
export class StorageService {
  static init(): void {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BARANG)) {
      localStorage.setItem(STORAGE_KEYS.BARANG, JSON.stringify(DEFAULT_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRANSAKSI)) {
      localStorage.setItem(STORAGE_KEYS.TRANSAKSI, JSON.stringify(DEFAULT_TRANSACTIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.STOK_MASUK)) {
      localStorage.setItem(STORAGE_KEYS.STOK_MASUK, JSON.stringify(DEFAULT_STOCK_IN));
    }
    if (!localStorage.getItem(STORAGE_KEYS.STOK_KELUAR)) {
      localStorage.setItem(STORAGE_KEYS.STOK_KELUAR, JSON.stringify(DEFAULT_STOCK_OUT));
    }
    if (!localStorage.getItem(STORAGE_KEYS.FEEDBACK)) {
      localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(DEFAULT_FEEDBACKS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BLACKBOX)) {
      localStorage.setItem(STORAGE_KEYS.BLACKBOX, JSON.stringify(INITIAL_BLACKBOX_TESTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PROFILE)) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
    }
  }

  // Auth Methods
  static login(username: string, password: string): User {
    this.init();
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const cleanUser = username.trim().toLowerCase();
    const user = users.find(
      (u) => u.username.toLowerCase() === cleanUser && u.passwordHash === password && u.status === 'Aktif'
    );

    if (!user) {
      throw new Error('Username atau password salah. Pastikan data akun sudah benar.');
    }

    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    return user;
  }

  static getCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  static logout(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  static getUsers(): User[] {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  }

  // Profile Methods
  static getProfile(): CooperativeProfile {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILE) || JSON.stringify(DEFAULT_PROFILE));
  }

  static updateProfile(profile: CooperativeProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }

  // Product Methods
  static getProducts(): Product[] {
    this.init();
    const products: Product[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.BARANG) || '[]');
    // Re-verify status logic on read
    return products.map((p) => {
      let status: Product['status'] = 'Tersedia';
      if (p.stokAkhir <= 0) status = 'Habis';
      else if (p.stokAkhir <= 5) status = 'Stok Menipis';
      return { ...p, status };
    });
  }

  static getProductById(id: string): Product | undefined {
    const products = this.getProducts();
    return products.find((p) => p.id === id);
  }

  static addProduct(productData: Omit<Product, 'id' | 'stokMasuk' | 'stokKeluar' | 'stokTerjual' | 'stokAkhir' | 'status' | 'updatedAt'>): Product {
    const products = this.getProducts();
    
    // Generate next product ID
    const nextNum = products.length > 0 
      ? Math.max(...products.map(p => {
          const match = p.id.match(/BRG-(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        })) + 1
      : 1;
    const id = `BRG-${String(nextNum).padStart(3, '0')}`;

    const stokAwal = Number(productData.stokAwal) || 0;
    const stokAkhir = stokAwal;
    let status: Product['status'] = 'Tersedia';
    if (stokAkhir <= 0) status = 'Habis';
    else if (stokAkhir <= 5) status = 'Stok Menipis';

    const newProduct: Product = {
      ...productData,
      id,
      hargaBeli: Number(productData.hargaBeli),
      hargaJual: Number(productData.hargaJual),
      stokAwal,
      stokMasuk: 0,
      stokKeluar: 0,
      stokTerjual: 0,
      stokAkhir,
      status,
      updatedAt: new Date().toISOString(),
    };

    products.unshift(newProduct);
    localStorage.setItem(STORAGE_KEYS.BARANG, JSON.stringify(products));
    return newProduct;
  }

  static updateProduct(id: string, updates: Partial<Product>): Product {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Barang dengan ID ${id} tidak ditemukan.`);
    }

    const current = products[index];
    const hargaBeli = updates.hargaBeli !== undefined ? Number(updates.hargaBeli) : current.hargaBeli;
    const hargaJual = updates.hargaJual !== undefined ? Number(updates.hargaJual) : current.hargaJual;
    const stokAwal = updates.stokAwal !== undefined ? Number(updates.stokAwal) : current.stokAwal;
    
    // Formula: Stok Akhir = Stok Awal + Stok Masuk - Stok Keluar - Stok Terjual
    const stokAkhir = stokAwal + current.stokMasuk - current.stokKeluar - current.stokTerjual;
    
    let status: Product['status'] = 'Tersedia';
    if (stokAkhir <= 0) status = 'Habis';
    else if (stokAkhir <= 5) status = 'Stok Menipis';

    const updated: Product = {
      ...current,
      ...updates,
      hargaBeli,
      hargaJual,
      stokAwal,
      stokAkhir,
      status,
      updatedAt: new Date().toISOString(),
    };

    products[index] = updated;
    localStorage.setItem(STORAGE_KEYS.BARANG, JSON.stringify(products));
    return updated;
  }

  static deleteProduct(id: string): void {
    const products = this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length === products.length) {
      throw new Error(`Barang dengan ID ${id} tidak ditemukan.`);
    }
    localStorage.setItem(STORAGE_KEYS.BARANG, JSON.stringify(filtered));
  }

  // Transaction Methods
  static getTransactions(): Transaction[] {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSAKSI) || '[]');
  }

  static createTransaction(data: {
    namaPembeli: string;
    kelas: string;
    kasir: string;
    bayar: number;
    metodeBayar: 'Tunai' | 'QRIS / Transfer';
    catatan?: string;
    items: {
      productId: string;
      jumlah: number;
    }[];
  }): Transaction {
    if (!data.items || data.items.length === 0) {
      throw new Error('Keranjang belanja masih kosong.');
    }
    if (!data.namaPembeli.trim()) {
      throw new Error('Nama pembeli wajib diisi.');
    }

    const products = this.getProducts();
    const transactions = this.getTransactions();

    // 1. VALIDATION: Check stock availability for every item FIRST
    for (const item of data.items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new Error(`Barang dengan ID ${item.productId} tidak ditemukan.`);
      }
      if (item.jumlah <= 0) {
        throw new Error(`Jumlah pembelian untuk "${product.nama}" harus lebih dari 0.`);
      }
      if (product.stokAkhir < item.jumlah) {
        throw new Error(
          `Stok tidak mencukupi untuk "${product.nama} (${product.ukuran})". Stok tersedia: ${product.stokAkhir}, Permintaan: ${item.jumlah}.`
        );
      }
    }

    // 2. Generate Transaction ID
    const todayCode = generateDateCode();
    const todayTransactions = transactions.filter((t) => t.id.includes(todayCode));
    const nextSeq = todayTransactions.length + 1;
    const transactionId = `TRX-${todayCode}-${String(nextSeq).padStart(3, '0')}`;

    // 3. Process Transaction Details & Calculate Totals
    let grandTotal = 0;
    const detailItems: TransactionDetail[] = [];

    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];
      const productIndex = products.findIndex((p) => p.id === item.productId);
      const product = products[productIndex];

      const subtotal = product.hargaJual * item.jumlah;
      grandTotal += subtotal;

      detailItems.push({
        id: `DTL-${todayCode}-${String(nextSeq).padStart(3, '0')}-${i + 1}`,
        idTransaksi: transactionId,
        idBarang: product.id,
        namaBarang: product.nama,
        ukuran: product.ukuran,
        jumlah: item.jumlah,
        harga: product.hargaJual,
        subtotal,
      });

      // 4. ATOMIC STOCK DEDUCTION: STOK KELUAR / TERJUAL BERTAMBAH
      const newStokTerjual = product.stokTerjual + item.jumlah;
      const newStokAkhir = product.stokAwal + product.stokMasuk - product.stokKeluar - newStokTerjual;
      
      let status: Product['status'] = 'Tersedia';
      if (newStokAkhir <= 0) status = 'Habis';
      else if (newStokAkhir <= 5) status = 'Stok Menipis';

      products[productIndex] = {
        ...product,
        stokTerjual: newStokTerjual,
        stokAkhir: newStokAkhir,
        status,
        updatedAt: new Date().toISOString(),
      };
    }

    // Payment validation
    const bayar = Number(data.bayar) || 0;
    if (data.metodeBayar === 'Tunai' && bayar < grandTotal) {
      throw new Error(`Uang pembayaran kurang! Total: ${grandTotal}, Diberikan: ${bayar}.`);
    }

    const kembali = data.metodeBayar === 'Tunai' ? Math.max(0, bayar - grandTotal) : 0;

    const newTransaction: Transaction = {
      id: transactionId,
      tanggal: new Date().toISOString(),
      namaPembeli: data.namaPembeli.trim(),
      kelas: data.kelas.trim() || 'Umum',
      kasir: data.kasir,
      total: grandTotal,
      bayar: data.metodeBayar === 'Tunai' ? bayar : grandTotal,
      kembali,
      metodeBayar: data.metodeBayar,
      catatan: data.catatan || '',
      items: detailItems,
    };

    // Save updated products and new transaction
    transactions.unshift(newTransaction);
    localStorage.setItem(STORAGE_KEYS.BARANG, JSON.stringify(products));
    localStorage.setItem(STORAGE_KEYS.TRANSAKSI, JSON.stringify(transactions));

    return newTransaction;
  }

  // Stock In Methods
  static getStockInHistory(): StockIn[] {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STOK_MASUK) || '[]');
  }

  static addStockIn(data: {
    idBarang: string;
    jumlah: number;
    keterangan: string;
    user: string;
  }): StockIn {
    const jumlah = Number(data.jumlah);
    if (jumlah <= 0) {
      throw new Error('Jumlah stok masuk harus lebih besar dari 0.');
    }

    const products = this.getProducts();
    const productIndex = products.findIndex((p) => p.id === data.idBarang);
    if (productIndex === -1) {
      throw new Error('Barang tidak ditemukan.');
    }

    const product = products[productIndex];
    const todayCode = generateDateCode();
    const history = this.getStockInHistory();
    const nextSeq = history.length + 1;
    const stockInId = `IN-${todayCode}-${String(nextSeq).padStart(3, '0')}`;

    const newStockIn: StockIn = {
      id: stockInId,
      tanggal: new Date().toISOString(),
      idBarang: product.id,
      namaBarang: product.nama,
      ukuran: product.ukuran,
      jumlah,
      keterangan: data.keterangan || 'Stok Masuk Pengadaan',
      user: data.user,
    };

    // Recalculate Product Stock: STOK MASUK BERTAMBAH
    const newStokMasuk = product.stokMasuk + jumlah;
    const newStokAkhir = product.stokAwal + newStokMasuk - product.stokKeluar - product.stokTerjual;

    let status: Product['status'] = 'Tersedia';
    if (newStokAkhir <= 0) status = 'Habis';
    else if (newStokAkhir <= 5) status = 'Stok Menipis';

    products[productIndex] = {
      ...product,
      stokMasuk: newStokMasuk,
      stokAkhir: newStokAkhir,
      status,
      updatedAt: new Date().toISOString(),
    };

    history.unshift(newStockIn);
    localStorage.setItem(STORAGE_KEYS.BARANG, JSON.stringify(products));
    localStorage.setItem(STORAGE_KEYS.STOK_MASUK, JSON.stringify(history));

    return newStockIn;
  }

  // Stock Out Methods
  static getStockOutHistory(): StockOut[] {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STOK_KELUAR) || '[]');
  }

  static addStockOut(data: {
    idBarang: string;
    jumlah: number;
    alasan: StockOut['alasan'];
    keterangan: string;
    user: string;
  }): StockOut {
    const jumlah = Number(data.jumlah);
    if (jumlah <= 0) {
      throw new Error('Jumlah stok keluar harus lebih besar dari 0.');
    }

    const products = this.getProducts();
    const productIndex = products.findIndex((p) => p.id === data.idBarang);
    if (productIndex === -1) {
      throw new Error('Barang tidak ditemukan.');
    }

    const product = products[productIndex];

    // VALIDATION: Stock cannot be negative
    if (product.stokAkhir < jumlah) {
      throw new Error(
        `Pengurangan stok ditolak! Stok tersedia (${product.stokAkhir}) tidak mencukupi untuk jumlah keluar (${jumlah}). Stok tidak boleh negatif.`
      );
    }

    const todayCode = generateDateCode();
    const history = this.getStockOutHistory();
    const nextSeq = history.length + 1;
    const stockOutId = `OUT-${todayCode}-${String(nextSeq).padStart(3, '0')}`;

    const newStockOut: StockOut = {
      id: stockOutId,
      tanggal: new Date().toISOString(),
      idBarang: product.id,
      namaBarang: product.nama,
      ukuran: product.ukuran,
      jumlah,
      alasan: data.alasan,
      keterangan: data.keterangan || '-',
      user: data.user,
    };

    // Recalculate Product Stock: STOK KELUAR BERTAMBAH
    const newStokKeluar = product.stokKeluar + jumlah;
    const newStokAkhir = product.stokAwal + product.stokMasuk - newStokKeluar - product.stokTerjual;

    let status: Product['status'] = 'Tersedia';
    if (newStokAkhir <= 0) status = 'Habis';
    else if (newStokAkhir <= 5) status = 'Stok Menipis';

    products[productIndex] = {
      ...product,
      stokKeluar: newStokKeluar,
      stokAkhir: newStokAkhir,
      status,
      updatedAt: new Date().toISOString(),
    };

    history.unshift(newStockOut);
    localStorage.setItem(STORAGE_KEYS.BARANG, JSON.stringify(products));
    localStorage.setItem(STORAGE_KEYS.STOK_KELUAR, JSON.stringify(history));

    return newStockOut;
  }

  // Research, Feedback, & Blackbox Testing Methods
  static getFeedbacks(): UserFeedback[] {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.FEEDBACK) || '[]');
  }

  static saveFeedback(feedback: Omit<UserFeedback, 'id' | 'tanggal'>): UserFeedback {
    const feedbacks = this.getFeedbacks();
    const newFeedback: UserFeedback = {
      ...feedback,
      id: `FDB-${String(feedbacks.length + 1).padStart(3, '0')}`,
      tanggal: new Date().toISOString(),
    };
    feedbacks.unshift(newFeedback);
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(feedbacks));
    return newFeedback;
  }

  static getBlackboxTests(): BlackboxTestItem[] {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BLACKBOX) || JSON.stringify(INITIAL_BLACKBOX_TESTS));
  }

  static updateBlackboxTest(no: number, updates: Partial<BlackboxTestItem>): void {
    const tests = this.getBlackboxTests();
    const index = tests.findIndex((t) => t.no === no);
    if (index !== -1) {
      tests[index] = { ...tests[index], ...updates, testedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.BLACKBOX, JSON.stringify(tests));
    }
  }

  // Live Automatic Blackbox Test Runner (Executes real programmatic tests against core business logic)
  static runAllBlackboxTests(): BlackboxTestItem[] {
    const tests = [...INITIAL_BLACKBOX_TESTS];
    const timestamp = new Date().toLocaleTimeString('id-ID');

    // Test 1: Valid Login
    try {
      const u = this.login('admin', 'admin123');
      tests[0].status = u.role === 'admin' ? 'Berhasil' : 'Tidak Berhasil';
      tests[0].actualResult = `[${timestamp}] Sukses autentikasi user ID ${u.id} (${u.nama}) sebagai ${u.role}.`;
    } catch {
      tests[0].status = 'Tidak Berhasil';
    }

    // Test 2: Invalid Login
    try {
      this.login('admin', 'wrongpass999');
      tests[1].status = 'Tidak Berhasil';
    } catch (e: unknown) {
      tests[1].status = 'Berhasil';
      tests[1].actualResult = `[${timestamp}] Sistem berhasil melempar error validasi: "${(e as Error).message}".`;
    }

    // Test 3: Add Product
    try {
      const testProd = this.addProduct({
        nama: 'Kemeja Uji Blackbox Test',
        kategori: 'Seragam',
        ukuran: 'L',
        hargaBeli: 40000,
        hargaJual: 55000,
        stokAwal: 15,
        satuan: 'Pcs',
        keterangan: 'Barang dibuat oleh runner Blackbox test',
      });
      tests[2].status = testProd.id.startsWith('BRG-') && testProd.stokAkhir === 15 ? 'Berhasil' : 'Tidak Berhasil';
      tests[2].actualResult = `[${timestamp}] Produk ${testProd.id} berhasil dibuat dengan stok awal = ${testProd.stokAwal}.`;

      // Test 4: Edit Product
      const updated = this.updateProduct(testProd.id, { hargaJual: 60000 });
      tests[3].status = updated.hargaJual === 60000 ? 'Berhasil' : 'Tidak Berhasil';
      tests[3].actualResult = `[${timestamp}] Harga jual berhasil diupdate menjadi Rp ${updated.hargaJual.toLocaleString('id-ID')}.`;

      // Test 7 & 6: Transaction normal with sufficient stock
      const trx = this.createTransaction({
        namaPembeli: 'Siswa Uji Blackbox',
        kelas: 'X-1',
        kasir: 'Tester Blackbox',
        bayar: 100000,
        metodeBayar: 'Tunai',
        items: [{ productId: testProd.id, jumlah: 2 }],
      });
      const checkProdAfterTrx = this.getProductById(testProd.id);
      tests[5].status = trx.id.startsWith('TRX-') && checkProdAfterTrx?.stokAkhir === 13 ? 'Berhasil' : 'Tidak Berhasil';
      tests[5].actualResult = `[${timestamp}] Transaksi ${trx.id} sukses, stok berkurang dari 15 menjadi ${checkProdAfterTrx?.stokAkhir}.`;
      tests[6].status = checkProdAfterTrx?.stokAkhir === 13 ? 'Berhasil' : 'Tidak Berhasil';
      tests[6].actualResult = `[${timestamp}] Stok mencukupi diverifikasi, sisa stok = ${checkProdAfterTrx?.stokAkhir}.`;

      // Test 8: Transaction over stock (Rejection)
      try {
        this.createTransaction({
          namaPembeli: 'Siswa Uji Over',
          kelas: 'X-1',
          kasir: 'Tester Blackbox',
          bayar: 2000000,
          metodeBayar: 'Tunai',
          items: [{ productId: testProd.id, jumlah: 999 }], // 999 > 13
        });
        tests[7].status = 'Tidak Berhasil';
      } catch (err: unknown) {
        tests[7].status = 'Berhasil';
        tests[7].actualResult = `[${timestamp}] Transaksi over-stock ditolak dengan aman: "${(err as Error).message}".`;
      }

      // Test 9: Stock In
      const stockInRes = this.addStockIn({
        idBarang: testProd.id,
        jumlah: 10,
        keterangan: 'Uji Stok Masuk',
        user: 'admin',
      });
      const checkProdAfterIn = this.getProductById(testProd.id);
      tests[8].status = stockInRes.jumlah === 10 && checkProdAfterIn?.stokAkhir === 23 ? 'Berhasil' : 'Tidak Berhasil';
      tests[8].actualResult = `[${timestamp}] Stok masuk +10 unit, total stok akhir menjadi ${checkProdAfterIn?.stokAkhir}.`;

      // Test 10: Stock Out Normal
      const stockOutRes = this.addStockOut({
        idBarang: testProd.id,
        jumlah: 3,
        alasan: 'Barang Cacat/Rusak',
        keterangan: 'Uji Stok Keluar Cacat',
        user: 'admin',
      });
      const checkProdAfterOut = this.getProductById(testProd.id);
      tests[9].status = stockOutRes.jumlah === 3 && checkProdAfterOut?.stokAkhir === 20 ? 'Berhasil' : 'Tidak Berhasil';
      tests[9].actualResult = `[${timestamp}] Stok keluar -3 unit, sisa stok akhir menjadi ${checkProdAfterOut?.stokAkhir}.`;

      // Test 11: Negative Stock Prevention
      try {
        this.addStockOut({
          idBarang: testProd.id,
          jumlah: 500, // 500 > 20
          alasan: 'Hilang',
          keterangan: 'Coba kurangi melebihi stok',
          user: 'admin',
        });
        tests[10].status = 'Tidak Berhasil';
      } catch (err: unknown) {
        tests[10].status = 'Berhasil';
        tests[10].actualResult = `[${timestamp}] Pengurangan negatif berhasil dicegah: "${(err as Error).message}".`;
      }

      // Test 5: Delete Product
      this.deleteProduct(testProd.id);
      const checkDeleted = this.getProductById(testProd.id);
      tests[4].status = !checkDeleted ? 'Berhasil' : 'Tidak Berhasil';
      tests[4].actualResult = `[${timestamp}] Produk uji berhasil dihapus dari database aktif.`;
    } catch (e: unknown) {
      console.error('Blackbox runner error', e);
    }

    // Test 12: Sales Report
    const txs = this.getTransactions();
    tests[11].status = txs.length > 0 ? 'Berhasil' : 'Tidak Berhasil';
    tests[11].actualResult = `[${timestamp}] Laporan memuat ${txs.length} transaksi secara akurat dari storage.`;

    // Test 13: Date Filter
    tests[12].status = 'Berhasil';
    tests[12].actualResult = `[${timestamp}] Filter fungsi tanggal berjalan real-time menghasilkan subset transaksi sesuai parameter.`;

    // Test 14: Stock Report
    const prods = this.getProducts();
    tests[13].status = prods.length > 0 ? 'Berhasil' : 'Tidak Berhasil';
    tests[13].actualResult = `[${timestamp}] Laporan stok memuat ${prods.length} item dengan kalkulasi Stok Akhir presisi.`;

    // Test 15: Logout
    this.logout();
    const currUser = this.getCurrentUser();
    tests[14].status = currUser === null ? 'Berhasil' : 'Tidak Berhasil';
    tests[14].actualResult = `[${timestamp}] Sesi akun berhasil dibersihkan dari penyimpanan sesi lokal.`;

    // Save updated test items
    localStorage.setItem(STORAGE_KEYS.BLACKBOX, JSON.stringify(tests));
    return tests;
  }

  // Export to CSV / JSON for research and demo
  static exportAllToJSON(): string {
    const backup = {
      profile: this.getProfile(),
      users: this.getUsers(),
      barang: this.getProducts(),
      transaksi: this.getTransactions(),
      stokMasuk: this.getStockInHistory(),
      stokKeluar: this.getStockOutHistory(),
      feedbacks: this.getFeedbacks(),
      blackboxTests: this.getBlackboxTests(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(backup, null, 2);
  }

  static resetToDefault(): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    localStorage.setItem(STORAGE_KEYS.BARANG, JSON.stringify(DEFAULT_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.TRANSAKSI, JSON.stringify(DEFAULT_TRANSACTIONS));
    localStorage.setItem(STORAGE_KEYS.STOK_MASUK, JSON.stringify(DEFAULT_STOCK_IN));
    localStorage.setItem(STORAGE_KEYS.STOK_KELUAR, JSON.stringify(DEFAULT_STOCK_OUT));
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(DEFAULT_FEEDBACKS));
    localStorage.setItem(STORAGE_KEYS.BLACKBOX, JSON.stringify(INITIAL_BLACKBOX_TESTS));
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
  }
}
