import React, { useState } from 'react';
import { Product, StockOut, User } from '../types';
import { StorageService } from '../services/storage';
import { formatDateTime } from '../utils/formatters';
import {
  ArrowUpRight,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Package,
  ShieldAlert,
} from 'lucide-react';

interface StokKeluarViewProps {
  products: Product[];
  stockOutHistory: StockOut[];
  currentUser: User;
  onRefresh: () => void;
}

const REASONS: StockOut['alasan'][] = [
  'Barang Cacat/Rusak',
  'Hilang',
  'Retur ke Suplier',
  'Sampel Contoh',
  'Lainnya',
];

export const StokKeluarView: React.FC<StokKeluarViewProps> = ({
  products,
  stockOutHistory,
  currentUser,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [jumlah, setJumlah] = useState<string>('1');
  const [alasan, setAlasan] = useState<StockOut['alasan']>('Barang Cacat/Rusak');
  const [keterangan, setKeterangan] = useState<string>('Jahitan sobek / cacat dari konveksi');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  // Filtered History
  const filteredHistory = stockOutHistory.filter((item) => {
    return (
      item.namaBarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.idBarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.alasan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.keterangan.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleOpenAdd = () => {
    if (products.length > 0) {
      setSelectedProductId(products[0].id);
    }
    setJumlah('1');
    setAlasan('Barang Cacat/Rusak');
    setKeterangan('Jahitan sobek / kancing lepas dari pabrik');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const qty = Number(jumlah);
      if (!selectedProductId) throw new Error('Silakan pilih barang terlebih dahulu.');
      if (qty <= 0) throw new Error('Jumlah stok keluar harus lebih besar dari 0.');

      // Prevent Negative Stock in UI prior to service call
      if (selectedProduct && qty > selectedProduct.stokAkhir) {
        throw new Error(
          `Pengurangan stok DITOLAK! Stok tersedia "${selectedProduct.nama}" hanya ${selectedProduct.stokAkhir} ${selectedProduct.satuan}. Jumlah pengurangan tidak boleh melebihi stok yang ada (Stok tidak boleh minus).`
        );
      }

      const newRecord = StorageService.addStockOut({
        idBarang: selectedProductId,
        jumlah: qty,
        alasan,
        keterangan: keterangan.trim(),
        user: `${currentUser.nama.split('(')[0].trim()} (${currentUser.username})`,
      });

      setIsModalOpen(false);
      onRefresh();
      showToast(
        'success',
        `Berhasil mencatat pengeluaran stok ${qty} ${selectedProduct?.satuan || 'unit'} untuk "${newRecord.namaBarang}" (Alasan: ${newRecord.alasan}).`
      );
    } catch (err: unknown) {
      showToast('error', (err as Error).message || 'Gagal menyimpan stok keluar.');
    }
  };

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-xl flex items-center gap-3 border text-sm max-w-md animate-in slide-in-from-top-4 duration-300 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">Pencatatan Stok Keluar Non-Penjualan</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Mencatat pengurangan stok seragam/atribut akibat cacat pabrik, barang rusak, retur, atau sampel.
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-sm font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Stok Keluar</span>
        </button>
      </div>

      {/* Rule Notification */}
      <div className="p-4 bg-rose-50/70 border border-rose-200/80 rounded-xl flex items-center justify-between text-xs text-rose-900">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-700 shrink-0" />
          <div>
            <span className="font-bold block">Aturan Validasi Stok Keluar (Cegah Nilai Negatif):</span>
            <span>
              <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-rose-300 font-bold text-rose-800">
                STOK AKHIR = STOK SEBELUMNYA - STOK KELUAR
              </code>
            </span>
          </div>
        </div>
        <span className="text-[11px] text-rose-700 font-medium hidden md:inline">
          Jika Pengurangan &gt; Stok Tersedia &rarr; Transaksi Ditolak Otomatis
        </span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari ID riwayat keluar, nama barang, alasan, atau keterangan..."
          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-600"
        />
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left">
            <thead className="bg-slate-50 text-slate-650 font-semibold uppercase text-[10px] sm:text-xs tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">ID Stok Keluar</th>
                <th className="py-3 px-4">Tanggal & Waktu</th>
                <th className="py-3 px-4">Kode & Nama Barang</th>
                <th className="py-3 px-3 text-center">Ukuran</th>
                <th className="py-3 px-3 text-center">Jumlah Keluar</th>
                <th className="py-3 px-3">Alasan</th>
                <th className="py-3 px-4">Keterangan</th>
                <th className="py-3 px-4">Pengurus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400 text-xs">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-50 text-slate-400" />
                    <p className="font-semibold text-slate-600">Belum ada riwayat stok keluar</p>
                    <p className="text-[11px] mt-0.5">Semua data stok keluar non-penjualan akan tercatat di sini.</p>
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-rose-700">{item.id}</td>
                    <td className="py-3 px-4 text-slate-600">{formatDateTime(item.tanggal)}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-slate-400 text-xs">#{item.idBarang} </span>
                      <strong className="text-slate-850">{item.namaBarang}</strong>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-xs">
                        {item.ukuran}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-rose-700">
                      -{item.jumlah}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-xs font-semibold">
                        {item.alasan}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{item.keterangan}</td>
                    <td className="py-3 px-4 text-slate-500 font-medium">{item.user}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
          <span>Total {filteredHistory.length} catatan riwayat stok keluar.</span>
        </div>
      </div>

      {/* Modal: Tambah Stok Keluar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-slate-800">Form Pengeluaran Stok (Cacat / Retur)</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pilih Barang <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-600"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} - {p.nama} ({p.ukuran}) &bull; Sisa Stok: {p.stokAkhir} {p.satuan}
                    </option>
                  ))}
                </select>
              </div>

              {selectedProduct && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">Stok Tersedia Saat Ini:</span>
                    <strong className="text-slate-800 text-sm">
                      {selectedProduct.stokAkhir} {selectedProduct.satuan}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Sisa Setelah Dikurangi:</span>
                    <strong
                      className={`text-sm font-mono ${
                        selectedProduct.stokAkhir - (Number(jumlah) || 0) < 0
                          ? 'text-rose-600 font-bold'
                          : 'text-slate-850'
                      }`}
                    >
                      {selectedProduct.stokAkhir - (Number(jumlah) || 0)} {selectedProduct.satuan}
                    </strong>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jumlah Keluar <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedProduct ? selectedProduct.stokAkhir : 999}
                    required
                    value={jumlah}
                    onChange={(e) => setJumlah(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-rose-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Alasan Pengeluaran <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={alasan}
                    onChange={(e) => setAlasan(e.target.value as StockOut['alasan'])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-600"
                  >
                    {REASONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Keterangan Rinci Kerusakan / Alasan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Contoh: Jahitan saku lepas / kain bernoda dari konveksi"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-600"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 px-4 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm transition-all"
                >
                  Simpan Stok Keluar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
