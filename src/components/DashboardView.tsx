import React, { useState } from 'react';
import { Product, Transaction, CooperativeProfile } from '../types';
import { formatRupiah, formatNumber, formatDateTime, getTodayDateString } from '../utils/formatters';
import {
  Package,
  Boxes,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  XCircle,
  ArrowRight,
  TrendingUp,
  Receipt,
  PlusCircle,
  ArrowDownLeft,
  CheckCircle2,
} from 'lucide-react';
import { ActiveTab } from './Sidebar';
import { ReceiptModal } from './ReceiptModal';

interface DashboardViewProps {
  products: Product[];
  transactions: Transaction[];
  profile: CooperativeProfile;
  setActiveTab: (tab: ActiveTab) => void;
  onQuickRestock?: (product: Product) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  products,
  transactions,
  profile,
  setActiveTab,
}) => {
  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null);

  // Statistics calculation
  const totalProducts = products.length;
  const totalStock = products.reduce((acc, p) => acc + p.stokAkhir, 0);

  const todayStr = getTodayDateString();
  const todayTransactions = transactions.filter((t) => t.tanggal.startsWith(todayStr));
  const todayTrxCount = todayTransactions.length;
  const todayRevenue = todayTransactions.reduce((acc, t) => acc + t.total, 0);

  const lowStockProducts = products.filter((p) => p.stokAkhir > 0 && p.stokAkhir <= 5);
  const outOfStockProducts = products.filter((p) => p.stokAkhir <= 0);

  // Total valuation calculation
  const totalStockValuation = products.reduce((acc, p) => acc + p.stokAkhir * p.hargaJual, 0);

  // Top selling categories
  const categorySalesMap: Record<string, { count: number; omset: number }> = {};
  transactions.forEach((tx) => {
    tx.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.idBarang);
      const cat = prod?.kategori || 'Seragam';
      if (!categorySalesMap[cat]) {
        categorySalesMap[cat] = { count: 0, omset: 0 };
      }
      categorySalesMap[cat].count += item.jumlah;
      categorySalesMap[cat].omset += item.subtotal;
    });
  });

  const topCategories = Object.entries(categorySalesMap)
    .map(([kategori, data]) => ({ kategori, ...data }))
    .sort((a, b) => b.omset - a.omset)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-blue-400/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> Sistem Berjalan Normal
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Selamat Datang di {profile.namaKoperasi}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Sistem informasi pengelolaan seragam, atribut, transaksi kasir, mutasi stok, serta pembuktian pengujian sistem untuk koperasi sekolah.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('kasir')}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Buka Kasir Baru</span>
            </button>
            <button
              onClick={() => setActiveTab('stok-masuk')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium rounded-xl flex items-center gap-2 border border-white/20 backdrop-blur-xs transition-all cursor-pointer"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Input Stok Masuk</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards (Section E Requirements) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* Total Produk */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Total Produk</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{formatNumber(totalProducts)}</span>
            <span className="text-[11px] text-slate-700 ml-1">Jenis item</span>
          </div>
        </div>

        {/* Total Stok Fisik */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Total Stok Fisik</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{formatNumber(totalStock)}</span>
            <span className="text-[11px] text-slate-700 ml-1">Pcs/Unit</span>
          </div>
        </div>

        {/* Transaksi Hari Ini */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Transaksi Hari Ini</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{formatNumber(todayTrxCount)}</span>
            <span className="text-[11px] text-slate-700 ml-1">Nota</span>
          </div>
        </div>

        {/* Penjualan Hari Ini */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Omset Hari Ini</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-lg sm:text-xl font-bold text-emerald-600 truncate block">
              {formatRupiah(todayRevenue)}
            </span>
          </div>
        </div>

        {/* Barang Stok Menipis */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700">Stok Menipis</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-600">{lowStockProducts.length}</span>
            <span className="text-[11px] text-amber-700 font-medium">≤ 5 unit tersisa</span>
          </div>
        </div>

        {/* Barang Habis */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700">Barang Habis</span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-rose-600">{outOfStockProducts.length}</span>
            <span className="text-[11px] text-rose-700 font-medium">0 unit stok</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Low Stock Warning & Top Category Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Stock & Out of Stock Alert Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-slate-800">
                  Peringatan Restock Barang (Stok Menipis & Habis)
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('barang')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Lihat Semua Barang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {lowStockProducts.length === 0 && outOfStockProducts.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="font-semibold text-slate-600">Semua Stok Barang Aman</p>
                <p className="text-[11px]">Tidak ada seragam atau atribut yang menipis saat ini.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-650 font-semibold uppercase text-[10px] tracking-wider border-y border-slate-100">
                    <tr>
                      <th className="py-2.5 px-3">Kode & Nama Barang</th>
                      <th className="py-2.5 px-2">Ukuran</th>
                      <th className="py-2.5 px-2">Kategori</th>
                      <th className="py-2.5 px-2 text-center">Sisa Stok</th>
                      <th className="py-2.5 px-2 text-center">Status</th>
                      <th className="py-2.5 px-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[...outOfStockProducts, ...lowStockProducts].slice(0, 5).map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3">
                          <span className="font-mono text-slate-500 font-medium">#{p.id}</span>
                          <p className="font-semibold text-slate-800 truncate max-w-[200px]">
                            {p.nama}
                          </p>
                        </td>
                        <td className="py-2.5 px-2">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[11px]">
                            {p.ukuran}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-slate-600">{p.kategori}</td>
                        <td className="py-2.5 px-2 text-center">
                          <span
                            className={`font-bold ${
                              p.stokAkhir === 0 ? 'text-rose-600' : 'text-amber-600'
                            }`}
                          >
                            {p.stokAkhir} {p.satuan}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.stokAkhir === 0
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => setActiveTab('stok-masuk')}
                            className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-[11px] inline-flex items-center gap-1 transition-colors"
                          >
                            <PlusCircle className="w-3 h-3" />
                            <span>Restock</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Estimasi Nilai Aset Stok Keseluruhan:</span>
            <span className="font-bold text-slate-800 font-mono text-sm">
              {formatRupiah(totalStockValuation)}
            </span>
          </div>
        </div>

        {/* Top Selling Categories & Summary (1 Col) */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-blue-100 text-blue-800 rounded-lg">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-800">Kategori Terlaris</h2>
            </div>

            <div className="space-y-3.5">
              {topCategories.map((cat, idx) => {
                const maxOmset = topCategories[0]?.omset || 1;
                const percentage = Math.round((cat.omset / maxOmset) * 100);
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{cat.kategori}</span>
                      <span className="text-slate-500 font-medium">
                        {cat.count} pcs ({formatRupiah(cat.omset)})
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              {topCategories.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs">
                  Belum ada data penjualan tercatat.
                </div>
              )}
            </div>
          </div>

          {/* Quick Guidance Box for Thesis */}
          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <span className="font-semibold text-slate-800 block mb-1">
              Catatan Penelitian (Bab 4):
            </span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Kalkulasi stok menerapkan rumus otomatis: <br />
              <code className="text-blue-700 font-mono bg-blue-50 px-1 py-0.5 rounded">
                Stok = Awal + Masuk - Keluar - Terjual
              </code>
            </p>
          </div>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <Receipt className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-800">5 Transaksi Penjualan Terbaru</h2>
          </div>
          <button
            onClick={() => setActiveTab('laporan-penjualan')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Buka Laporan Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-650 font-semibold uppercase text-[10px] tracking-wider border-y border-slate-100">
              <tr>
                <th className="py-2.5 px-3">No. Nota & Waktu</th>
                <th className="py-2.5 px-3">Nama Pembeli</th>
                <th className="py-2.5 px-2">Kelas</th>
                <th className="py-2.5 px-3">Barang Terbeli</th>
                <th className="py-2.5 px-3 text-right">Total Transaksi</th>
                <th className="py-2.5 px-3">Kasir</th>
                <th className="py-2.5 px-3 text-center">Struk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.slice(0, 5).map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3">
                    <span className="font-mono font-bold text-slate-800">{trx.id}</span>
                    <p className="text-[11px] text-slate-400">{formatDateTime(trx.tanggal)}</p>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{trx.namaPembeli}</td>
                  <td className="py-2.5 px-2">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                      {trx.kelas}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    <span className="font-medium text-slate-800">
                      {trx.items.map((i) => `${i.namaBarang} (${i.ukuran}) x${i.jumlah}`).join(', ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900 font-mono">
                    {formatRupiah(trx.total)}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">{trx.kasir}</td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => setSelectedReceipt(trx)}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] inline-flex items-center gap-1 transition-colors"
                    >
                      <Receipt className="w-3 h-3 text-slate-500" />
                      <span>Lihat Struk</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
