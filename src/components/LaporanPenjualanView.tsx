import React, { useState } from 'react';
import { Transaction, CooperativeProfile } from '../types';
import { formatRupiah, formatNumber, formatDateTime, formatDate, getTodayDateString } from '../utils/formatters';
import {
  Receipt,
  Calendar,
  Printer,
  Download,
  Search,
  Eye,
  DollarSign,
  ShoppingCart,
  Boxes,
  School,
} from 'lucide-react';
import { ReceiptModal } from './ReceiptModal';

interface LaporanPenjualanViewProps {
  transactions: Transaction[];
  profile: CooperativeProfile;
}

export const LaporanPenjualanView: React.FC<LaporanPenjualanViewProps> = ({
  transactions,
  profile,
}) => {
  const today = getTodayDateString();
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(today);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedKasir, setSelectedKasir] = useState<string>('Semua');
  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null);

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    const txDate = t.tanggal.split('T')[0];
    const matchDate = (!startDate || txDate >= startDate) && (!endDate || txDate <= endDate);
    const matchSearch =
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.namaPembeli.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.items.some((i) => i.namaBarang.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchKasir = selectedKasir === 'Semua' || t.kasir.includes(selectedKasir);

    return matchDate && matchSearch && matchKasir;
  });

  // Calculate totals
  const totalTransaksi = filteredTransactions.length;
  const totalBarangTerjual = filteredTransactions.reduce(
    (acc, t) => acc + t.items.reduce((s, i) => s + i.jumlah, 0),
    0
  );
  const totalPendapatan = filteredTransactions.reduce((acc, t) => acc + t.total, 0);

  // Unique Cashiers for filter
  const kasirList = Array.from(new Set(transactions.map((t) => t.kasir)));

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID Transaksi', 'Tanggal', 'Nama Pembeli', 'Kelas', 'Kasir', 'Metode Bayar', 'Barang', 'Ukuran', 'Jumlah', 'Harga', 'Subtotal', 'Total Transaksi'];
    
    const rows: string[][] = [];
    filteredTransactions.forEach((t) => {
      t.items.forEach((item, idx) => {
        rows.push([
          t.id,
          formatDateTime(t.tanggal),
          `"${t.namaPembeli}"`,
          `"${t.kelas}"`,
          `"${t.kasir}"`,
          t.metodeBayar,
          `"${item.namaBarang}"`,
          item.ukuran,
          String(item.jumlah),
          String(item.harga),
          String(item.subtotal),
          idx === 0 ? String(t.total) : '',
        ]);
      });
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Penjualan_Koperasi_${startDate}_sd_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const setDatePreset = (preset: 'today' | '7days' | 'month' | 'all') => {
    const now = new Date();
    if (preset === 'today') {
      setStartDate(today);
      setEndDate(today);
    } else if (preset === '7days') {
      const past = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      setStartDate(past.toISOString().split('T')[0]);
      setEndDate(today);
    } else if (preset === 'month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      setStartDate(firstDay.toISOString().split('T')[0]);
      setEndDate(today);
    } else if (preset === 'all') {
      setStartDate('2025-01-01');
      setEndDate(today);
    }
  };

  return (
    <div className="space-y-5">
      {/* Official Print Header (Only visible during window.print()) */}
      <div className="hidden print-only mb-6 text-center border-b-2 border-slate-900 pb-4">
        <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900">
          {profile.namaKoperasi}
        </h1>
        <h2 className="text-sm font-semibold text-slate-800">{profile.namaSekolah}</h2>
        <p className="text-xs text-slate-600">{profile.alamat} &bull; Telp: {profile.telepon}</p>
        <div className="mt-3 py-1 bg-slate-100 font-bold text-xs uppercase tracking-wide border-y border-slate-300">
          LAPORAN REKAPITULASI PENJUALAN SERAGAM & ATRIBUT SEKOLAH
        </div>
        <p className="text-xs text-slate-600 mt-1">
          Periode: {formatDate(startDate)} s/d {formatDate(endDate)}
        </p>
      </div>

      {/* Screen Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs no-print">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">Laporan Penjualan</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Rekapitulasi omset, barang terjual, dan histori transaksi penjualan kasir koperasi.
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
            <span>Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* Filter Card (No Print) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3 no-print">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Start Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Tanggal Awal</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Tanggal Akhir</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Kasir Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Filter Kasir</label>
            <select
              value={selectedKasir}
              onChange={(e) => setSelectedKasir(e.target.value)}
              className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              <option value="Semua">Semua Kasir</option>
              {kasirList.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Cari Pembeli / Barang</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nama siswa, kelas, nota..."
                className="w-full pl-8 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Quick Date Presets */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-bold text-slate-500 mr-1">Preset Cepat:</span>
          <button
            type="button"
            onClick={() => setDatePreset('today')}
            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 transition-colors"
          >
            Hari Ini
          </button>
          <button
            type="button"
            onClick={() => setDatePreset('7days')}
            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 transition-colors"
          >
            7 Hari Terakhir
          </button>
          <button
            type="button"
            onClick={() => setDatePreset('month')}
            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 transition-colors"
          >
            Bulan Ini
          </button>
          <button
            type="button"
            onClick={() => setDatePreset('all')}
            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 transition-colors"
          >
            Semua Data
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-700 block">Total Transaksi</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">
              {formatNumber(totalTransaksi)}
            </span>
            <span className="text-[11px] text-slate-700">Nota penjualan</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-700 block">Total Barang Terjual</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">
              {formatNumber(totalBarangTerjual)}
            </span>
            <span className="text-[11px] text-slate-700">Pcs / Unit seragam & atribut</span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Boxes className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-800 block">Total Pendapatan (Omset)</span>
            <span className="text-xl sm:text-2xl font-bold text-emerald-700 mt-1 block font-mono">
              {formatRupiah(totalPendapatan)}
            </span>
            <span className="text-[11px] text-emerald-800 font-medium">Periode terpilih</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Transaction Details Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left">
            <thead className="bg-slate-50 text-slate-650 font-semibold uppercase text-[10px] sm:text-xs tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">ID Transaksi</th>
                <th className="py-3 px-4">Tanggal & Waktu</th>
                <th className="py-3 px-4">Pembeli / Siswa</th>
                <th className="py-3 px-2">Kelas</th>
                <th className="py-3 px-4">Rincian Barang & Ukuran</th>
                <th className="py-3 px-3 text-center">Jumlah</th>
                <th className="py-3 px-4 text-right">Total Transaksi</th>
                <th className="py-3 px-3">Kasir</th>
                <th className="py-3 px-3 text-center no-print">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400 text-xs">
                    <Receipt className="w-8 h-8 mx-auto mb-2 opacity-50 text-slate-400" />
                    <p className="font-semibold text-slate-600">Tidak ada data transaksi penjualan</p>
                    <p className="text-[11px] mt-0.5">Coba ubah filter rentang tanggal atau kata kunci.</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((trx) => {
                  const totalQtyInTrx = trx.items.reduce((s, i) => s + i.jumlah, 0);
                  return (
                    <tr key={trx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">{trx.id}</td>
                      <td className="py-3 px-4 text-slate-600">{formatDateTime(trx.tanggal)}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{trx.namaPembeli}</td>
                      <td className="py-3 px-2">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-xs">
                          {trx.kelas}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        <div className="space-y-1">
                          {trx.items.map((it, idx) => (
                            <div key={idx} className="text-xs">
                              &bull; {it.namaBarang}{' '}
                              <span className="font-bold text-blue-700">({it.ukuran})</span> x{it.jumlah}{' '}
                              <span className="text-slate-400 font-mono text-[11px]">
                                @{formatRupiah(it.harga)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-800">
                        {totalQtyInTrx} unit
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        {formatRupiah(trx.total)}
                        <span className="block text-[10px] text-slate-600 font-normal">
                          {trx.metodeBayar}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500 text-xs">{trx.kasir}</td>
                      <td className="py-3 px-3 text-center no-print">
                        <button
                          onClick={() => setSelectedReceipt(trx)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Lihat & Cetak Struk"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {filteredTransactions.length > 0 && (
              <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-300 text-slate-900 text-xs sm:text-sm">
                <tr>
                  <td colSpan={5} className="py-3 px-4 text-right">
                    TOTAL KESELURUHAN:
                  </td>
                  <td className="py-3 px-3 text-center font-mono">{totalBarangTerjual} unit</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-800">
                    {formatRupiah(totalPendapatan)}
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Official Signature Section for Printed Report */}
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
            <p className="font-bold">Pengurus / Kasir</p>
            <div className="h-16" />
            <p className="font-bold underline">Petugas Koperasi</p>
            <p className="text-[11px] text-slate-600">Koperasi Sekolah</p>
          </div>
        </div>
      </div>

      {/* Struk Modal */}
      {selectedReceipt && (
        <ReceiptModal
          transaction={selectedReceipt}
          profile={profile}
          isOpen={true}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
};
