export type UserRole = 'admin' | 'kasir';

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  nama: string;
  role: UserRole;
  status: 'Aktif' | 'Nonaktif';
}

export type ProductCategory =
  | 'Seragam'
  | 'Celana'
  | 'Rok'
  | 'Topi'
  | 'Dasi'
  | 'Ikat Pinggang'
  | 'Atribut'
  | 'Kaos Kaki'
  | 'Lainnya';

export type ProductUnit = 'Pcs' | 'Pasang' | 'Stel' | 'Lembar' | 'Buku';

export type StockStatus = 'Tersedia' | 'Stok Menipis' | 'Habis';

export interface Product {
  id: string; // e.g. BRG-001
  nama: string;
  kategori: ProductCategory;
  ukuran: string; // e.g. S, M, L, XL, XXL, 1, 2, 3, 28, 29, All Size
  hargaBeli: number;
  hargaJual: number;
  stokAwal: number;
  stokMasuk: number;
  stokKeluar: number;
  stokTerjual: number;
  stokAkhir: number;
  satuan: ProductUnit;
  status: StockStatus;
  keterangan?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  jumlah: number;
  subtotal: number;
}

export interface TransactionDetail {
  id: string;
  idTransaksi: string;
  idBarang: string;
  namaBarang: string;
  ukuran: string;
  jumlah: number;
  harga: number;
  subtotal: number;
}

export interface Transaction {
  id: string; // TRX-YYYYMMDD-001
  tanggal: string; // ISO string
  namaPembeli: string;
  kelas: string; // e.g. X MIPA 1, VII-B, Guru/Karyawan, Umum
  kasir: string;
  total: number;
  bayar: number;
  kembali: number;
  metodeBayar: 'Tunai' | 'QRIS / Transfer';
  catatan?: string;
  items: TransactionDetail[];
}

export interface StockIn {
  id: string; // IN-YYYYMMDD-001
  tanggal: string;
  idBarang: string;
  namaBarang: string;
  ukuran: string;
  jumlah: number;
  keterangan: string; // e.g. "Kiriman Konveksi CV Maju Jaya", "Pengadaan Semester Baru"
  user: string;
}

export interface StockOut {
  id: string; // OUT-YYYYMMDD-001
  tanggal: string;
  idBarang: string;
  namaBarang: string;
  ukuran: string;
  jumlah: number;
  alasan: 'Barang Cacat/Rusak' | 'Hilang' | 'Retur ke Suplier' | 'Sampel Contoh' | 'Lainnya';
  keterangan: string;
  user: string;
}

export interface UserFeedback {
  id: string;
  pengurusName: string; // "Pengurus 1 (Ibu Siti Rahayu)" | "Pengurus 2 (Bpk. Joko Purnomo)"
  role: string;
  tanggal: string;
  skenarioTugas: string[];
  kemudahanScore: number; // 1 - 5
  kecepatanScore: number; // 1 - 5
  komentarKelebihan: string;
  komentarKendala: string;
  saranPengembangan: string;
}

export interface BlackboxTestItem {
  no: number;
  fitur: string;
  skenario: string;
  input: string;
  expectedResult: string;
  actualResult: string;
  status: 'Berhasil' | 'Tidak Berhasil' | 'Belum Diuji';
  testedAt?: string;
}

export interface CooperativeProfile {
  namaSekolah: string;
  namaKoperasi: string;
  alamat: string;
  telepon: string;
  ketuaKoperasi: string;
  nipKetua?: string;
  pesanStruk: string;
}
