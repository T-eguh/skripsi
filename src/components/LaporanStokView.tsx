import React, { useState } from 'react';
import { Product, CooperativeProfile } from '../types';
import { formatRupiah, formatNumber, formatDate } from '../utils/formatters';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Search,
  Filter,
  Package,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';

interface LaporanStokViewProps {
  products: Product[];
  profile: CooperativeProfile;
}

export const LaporanStokView: React.FC<LaporanStokViewProps> = ({ products, profile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const categories = [
    'Semua',
    'Seragam',
    'Celana',
    'Rok',
    'Topi',
    'Dasi',
    'Ikat Pinggang',
    'Atribut',
    'Kaos Kaki',
    'Lainnya',
  ];

  // Filtered Products
  const filteredProducts = products.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ukuran.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = selectedStatus === 'Semua' || item.status === selectedStatus;
    const matchCategory = selectedCategory === 'Semua' || item.kategori === selectedCategory;

    return matchSearch && matchStatus && matchCategory;
  });

  // Calculate Totals
  const totalItemCount = filteredProducts.length;
  const totalStokAwal = filteredProducts.reduce((acc, p) => acc + p.stokAwal, 0);
  const totalStokMasuk = filteredProducts.reduce((acc, p) => acc + p.stokMasuk, 0);
  const totalStokKeluar = filteredProducts.reduce((acc, p) => acc + p.stokKeluar, 0);
  const totalStokTerjual = filteredProducts.reduce((acc, p) => acc + p.stokTerjual, 0);
  const totalStokAkhir = filteredProducts.reduce((acc, p) => acc + p.stokAkhir, 0);
  const totalNilaiAsetModal = filteredProducts.reduce(
    (acc, p) => acc + p.stokAkhir * p.hargaBeli,
    0
  );
  const totalNilaiAsetJual = filteredProducts.reduce(
    (acc, p) => acc + p.stokAkhir * p.hargaJual,
    0
  );

  const availableCount = products.filter((p) => p.status === 'Tersedia').length;
  const lowCount = products.filter((p) => p.status === 'Stok Menipis').length;
  const outCount = products.filter((p) => p.status === 'Habis').length;

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'ID Barang',
      'Nama Barang',
      'Kategori',
      'Ukuran',
      'Harga Beli',
      'Harga Jual',
      'Stok Awal',
      'Stok Masuk',
      'Stok Keluar',
      'Stok Terjual',
      'Stok Akhir',
      'Satuan',
      'Status',
      'Nilai Aset Jual',
    ];

    const rows = filteredProducts.map((p) => [
      p.id,
      `"${p.nama}"`,
      p.kategori,
      p.ukuran,
      String(p.hargaBeli),
      String(p.hargaJual),
      String(p.stokAwal),
      String(p.stokMasuk),
      String(p.stokKeluar),
      String(p.stokTerjual),
      String(p.stokAkhir),
      p.satuan,
      p.status,
      String(p.stokAkhir * p.hargaJual),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Stok_Barang_Koperasi_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      {/* Official Print Header */}
      <div className="hidden print-only mb-6 text-center border-b-2 border-slate-900 pb-4">
        <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900">
          {profile.namaKoperasi}
        </h1>
        <h2 className="text-sm font-semibold text-slate-800">{profile.namaSekolah}</h2>
        <p className="text-xs text-slate-600">{profile.alamat} &bull; Telp: {profile.telepon}</p>
        <div className="mt-3 py-1 bg-slate-100 font-bold text-xs uppercase tracking-wide border-y border-slate-300">
          LAPORAN MUTASI & SALDO AKHIR STOK BARANG
        </div>
        <p className="text-xs text-slate-600 mt-1">
          Per Tanggal: {formatDate(new Date().toISOString())}
        </p>
      </div>

      {/* Screen Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs no-print">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">Laporan Stok & Mutasi Barang</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Pemantauan mutasi stok: Stok Awal + Stok Masuk - Stok Keluar - Stok Terjual = Stok Akhir.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Laporan Stok</span>
          </button>
        </div>
      </div>

      {/* Filter Card (No Print) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3 no-print">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari kode atau nama barang..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  Kategori: {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              <option value="Semua">Semua Status Stok ({products.length})</option>
              <option value="Tersedia">Tersedia ({availableCount})</option>
              <option value="Stok Menipis">Stok Menipis ({lowCount})</option>
              <option value="Habis">Habis ({outCount})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-700 block">Total Jenis Item</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">
            {formatNumber(totalItemCount)}
          </span>
          <span className="text-[11px] text-slate-700">SKU / Produk</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-700 block">Total Stok Fisik Akhir</span>
          <span className="text-xl font-bold text-blue-700 mt-1 block font-mono">
            {formatNumber(totalStokAkhir)}
          </span>
          <span className="text-[11px] text-slate-700">Unit / Pcs</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-700 block">Nilai Aset Modal</span>
          <span className="text-base sm:text-lg font-bold text-slate-850 mt-1 block font-mono">
            {formatRupiah(totalNilaiAsetModal)}
          </span>
          <span className="text-[11px] text-slate-700">Berdasarkan Harga Beli</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-emerald-800 block">Potensi Nilai Jual</span>
          <span className="text-base sm:text-lg font-bold text-emerald-700 mt-1 block font-mono">
            {formatRupiah(totalNilaiAsetJual)}
          </span>
          <span className="text-[11px] text-emerald-800 font-medium">Berdasarkan Harga Jual</span>
        </div>
      </div>

      {/* Stock Report Balance Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left">
            <thead className="bg-slate-50 text-slate-650 font-semibold uppercase text-[10px] sm:text-xs tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Kode</th>
                <th className="py-3 px-3">Nama Barang</th>
                <th className="py-3 px-2">Kategori</th>
                <th className="py-3 px-2 text-center">Ukuran</th>
                <th className="py-3 px-2 text-center bg-slate-100/60">Awal</th>
                <th className="py-3 px-2 text-center bg-emerald-50/60 text-emerald-800">Masuk (+)</th>
                <th className="py-3 px-2 text-center bg-rose-50/60 text-rose-800">Keluar (-)</th>
                <th className="py-3 px-2 text-center bg-blue-50/60 text-blue-800">Terjual (-)</th>
                <th className="py-3 px-2 text-center font-bold text-slate-900 bg-slate-100">
                  Stok Akhir
                </th>
                <th className="py-3 px-3 text-right">Nilai Jual (Rp)</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-10 text-center text-slate-400 text-xs">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-50 text-slate-400" />
                    <p className="font-semibold text-slate-600">Tidak ada barang sesuai filter</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const nilaiJualItem = p.stokAkhir * p.hargaJual;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{p.id}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{p.nama}</td>
                      <td className="py-2.5 px-2 text-slate-600 text-xs">{p.kategori}</td>
                      <td className="py-2.5 px-2 text-center">
                        <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-xs">
                          {p.ukuran}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono text-slate-500 bg-slate-50/40">
                        {p.stokAwal}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-semibold text-emerald-700 bg-emerald-50/30">
                        +{p.stokMasuk}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-semibold text-rose-700 bg-rose-50/30">
                        -{p.stokKeluar}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-semibold text-blue-700 bg-blue-50/30">
                        -{p.stokTerjual}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-slate-900 bg-slate-100/80 text-sm">
                        {p.stokAkhir} <span className="text-[10px] font-normal text-slate-500">{p.satuan}</span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-850 text-xs">
                        {formatRupiah(nilaiJualItem)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status === 'Habis'
                              ? 'bg-rose-100 text-rose-700'
                              : p.status === 'Stok Menipis'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {filteredProducts.length > 0 && (
              <tfoot className="bg-slate-100/90 font-bold border-t-2 border-slate-300 text-slate-900 text-xs">
                <tr>
                  <td colSpan={4} className="py-3 px-3 text-right">
                    TOTAL SALDO MUTASI:
                  </td>
                  <td className="py-3 px-2 text-center font-mono">{totalStokAwal}</td>
                  <td className="py-3 px-2 text-center font-mono text-emerald-700">+{totalStokMasuk}</td>
                  <td className="py-3 px-2 text-center font-mono text-rose-700">-{totalStokKeluar}</td>
                  <td className="py-3 px-2 text-center font-mono text-blue-700">-{totalStokTerjual}</td>
                  <td className="py-3 px-2 text-center font-mono text-slate-900 font-extrabold text-sm">
                    {totalStokAkhir}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-800">
                    {formatRupiah(totalNilaiAsetJual)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Official Signatures */}
      <div className="hidden print-only mt-12 pt-6">
        <div className="flex justify-between text-xs text-slate-800">
          <div className="text-center w-48">
            <p>Mengetahui,</p>
            <p className="font-bold">Ketua Koperasi Sekolah</p>
            <div className="h-16" />
            <p className="font-bold underline">{profile.ketuaKoperasi}</p>
            <p className="text-[11px] text-slate-600">NIP: {profile.nipKetua || '-'}</p>
          </div>

          <div className="text-center w-48">
            <p>
              Dicetak pada:{' '}
              {new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <p className="font-bold">Bagian Pengelola Stok</p>
            <div className="h-16" />
            <p className="font-bold underline">Petugas Gudang Koperasi</p>
            <p className="text-[11px] text-slate-600">Koperasi Sekolah</p>
          </div>
        </div>
      </div>
    </div>
  );
};
