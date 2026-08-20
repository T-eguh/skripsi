import React, { useState } from 'react';
import { Product, ProductCategory, ProductUnit, User } from '../types';
import { StorageService } from '../services/storage';
import { formatRupiah } from '../utils/formatters';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';

interface DataBarangViewProps {
  products: Product[];
  currentUser: User;
  onRefresh: () => void;
}

const CATEGORIES: ProductCategory[] = [
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

const UNITS: ProductUnit[] = ['Pcs', 'Pasang', 'Stel', 'Lembar', 'Buku'];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'All Size', '26', '27', '28', '29', '30', '31', '32', 'No 1', 'No 2', 'No 3', 'No 4', 'No 5', 'No 6'];

export const DataBarangView: React.FC<DataBarangViewProps> = ({
  products,
  currentUser,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nama: '',
    kategori: 'Seragam' as ProductCategory,
    ukuran: 'M',
    customUkuran: '',
    hargaBeli: '',
    hargaJual: '',
    stokAwal: '20',
    satuan: 'Pcs' as ProductUnit,
    keterangan: '',
  });

  // Notification Toast
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Filtered Products
  const filteredProducts = products.filter((item) => {
    const matchesSearch =
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ukuran.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'Semua' || item.kategori === selectedCategory;
    const matchesStatus = selectedStatus === 'Semua' || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Open Add Modal
  const handleOpenAdd = () => {
    setFormData({
      nama: '',
      kategori: 'Seragam',
      ukuran: 'M',
      customUkuran: '',
      hargaBeli: '',
      hargaJual: '',
      stokAwal: '20',
      satuan: 'Pcs',
      keterangan: '',
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      nama: product.nama,
      kategori: product.kategori,
      ukuran: SIZES.includes(product.ukuran) ? product.ukuran : 'Lainnya',
      customUkuran: SIZES.includes(product.ukuran) ? '' : product.ukuran,
      hargaBeli: String(product.hargaBeli),
      hargaJual: String(product.hargaJual),
      stokAwal: String(product.stokAwal),
      satuan: product.satuan,
      keterangan: product.keterangan || '',
    });
  };

  // Submit Add
  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const finalUkuran = formData.ukuran === 'Lainnya' ? formData.customUkuran.trim() : formData.ukuran;
      if (!formData.nama.trim()) throw new Error('Nama barang wajib diisi.');
      if (!finalUkuran) throw new Error('Ukuran barang wajib diisi.');
      if (!formData.hargaBeli || Number(formData.hargaBeli) < 0) throw new Error('Harga beli tidak valid.');
      if (!formData.hargaJual || Number(formData.hargaJual) < 0) throw new Error('Harga jual tidak valid.');

      const newProd = StorageService.addProduct({
        nama: formData.nama.trim(),
        kategori: formData.kategori,
        ukuran: finalUkuran,
        hargaBeli: Number(formData.hargaBeli),
        hargaJual: Number(formData.hargaJual),
        stokAwal: Number(formData.stokAwal) || 0,
        satuan: formData.satuan,
        keterangan: formData.keterangan.trim(),
      });

      setIsAddModalOpen(false);
      onRefresh();
      showToast('success', `Barang baru "${newProd.nama} (${newProd.ukuran})" berhasil ditambahkan dengan ID ${newProd.id}!`);
    } catch (err: unknown) {
      showToast('error', (err as Error).message || 'Gagal menambahkan barang.');
    }
  };

  // Submit Edit
  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const finalUkuran = formData.ukuran === 'Lainnya' ? formData.customUkuran.trim() : formData.ukuran;
      if (!formData.nama.trim()) throw new Error('Nama barang wajib diisi.');
      if (!finalUkuran) throw new Error('Ukuran barang wajib diisi.');

      const updated = StorageService.updateProduct(editingProduct.id, {
        nama: formData.nama.trim(),
        kategori: formData.kategori,
        ukuran: finalUkuran,
        hargaBeli: Number(formData.hargaBeli),
        hargaJual: Number(formData.hargaJual),
        satuan: formData.satuan,
        keterangan: formData.keterangan.trim(),
      });

      setEditingProduct(null);
      onRefresh();
      showToast('success', `Data barang ${updated.id} - ${updated.nama} berhasil diperbarui.`);
    } catch (err: unknown) {
      showToast('error', (err as Error).message || 'Gagal mengedit barang.');
    }
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deletingProduct) return;
    try {
      StorageService.deleteProduct(deletingProduct.id);
      showToast('success', `Barang "${deletingProduct.nama}" (${deletingProduct.id}) berhasil dihapus.`);
      setDeletingProduct(null);
      onRefresh();
    } catch (err: unknown) {
      showToast('error', (err as Error).message || 'Gagal menghapus barang.');
    }
  };

  // Quick Preset Helper
  const applyPreset = (nama: string, kategori: ProductCategory, hargaBeli: number, hargaJual: number, satuan: ProductUnit) => {
    setFormData((prev) => ({
      ...prev,
      nama,
      kategori,
      hargaBeli: String(hargaBeli),
      hargaJual: String(hargaJual),
      satuan,
    }));
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

      {/* Header & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-slate-800">Master Data Barang Koperasi</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar seluruh seragam sekolah, celana, rok, topi, dasi, ikat pinggang, kaos kaki, dan atribut.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Barang Baru</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search Input */}
        <div className="relative sm:col-span-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari kode, nama, atau ukuran..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-2 px-3 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="Semua">Semua Kategori</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full py-2 px-3 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="Semua">Semua Status Stok</option>
            <option value="Tersedia">Tersedia (&gt; 5)</option>
            <option value="Stok Menipis">Stok Menipis (1 - 5)</option>
            <option value="Habis">Habis (0)</option>
          </select>
        </div>
      </div>

      {/* Main Products Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left">
            <thead className="bg-slate-50 text-slate-650 font-semibold uppercase text-[10px] sm:text-xs tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">ID Barang</th>
                <th className="py-3 px-4">Nama Barang</th>
                <th className="py-3 px-3">Kategori</th>
                <th className="py-3 px-3 text-center">Ukuran</th>
                <th className="py-3 px-3 text-right">Harga Beli</th>
                <th className="py-3 px-3 text-right">Harga Jual</th>
                <th className="py-3 px-3 text-center">Stok Akhir</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400 text-xs">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-50 text-slate-400" />
                    <p className="font-semibold text-slate-600">Tidak ada data barang ditemukan</p>
                    <p className="text-[11px] mt-0.5">Coba ubah kata kunci pencarian atau filter kategori.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const margin = p.hargaJual - p.hargaBeli;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">{p.id}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{p.nama}</div>
                        {p.keterangan && (
                          <div className="text-[11px] text-slate-400 truncate max-w-xs">
                            {p.keterangan}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-medium">
                          {p.kategori}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-xs border border-blue-100">
                          {p.ukuran}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-slate-500 font-mono text-xs">
                        {formatRupiah(p.hargaBeli)}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900 font-mono">
                        {formatRupiah(p.hargaJual)}
                        <span className="block text-[10px] text-emerald-600 font-normal">
                          +{formatRupiah(margin)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-800">
                        <span className="text-sm">{p.stokAkhir}</span>{' '}
                        <span className="text-[11px] text-slate-500 font-normal">{p.satuan}</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status === 'Habis'
                              ? 'bg-rose-100 text-rose-700 border border-rose-200'
                              : p.status === 'Stok Menipis'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit Barang"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingProduct(p)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Hapus Barang"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            Menampilkan <strong>{filteredProducts.length}</strong> dari <strong>{products.length}</strong> total jenis seragam & atribut.
          </span>
          <span className="font-medium text-slate-600">
            Koperasi Sekolah Sistem Informasi &bull; Role: {currentUser.role}
          </span>
        </div>
      </div>

      {/* Modal: Tambah Barang */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800">Form Tambah Data Barang Baru</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Presets for Uniforms */}
            <div className="px-6 pt-4 pb-2 bg-blue-50/50 border-b border-blue-100/50">
              <div className="flex items-center gap-1 text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Template Cepat Seragam Koperasi:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => applyPreset('Kemeja Putih OSIS', 'Seragam', 52000, 65000, 'Pcs')}
                  className="px-2 py-1 bg-white border border-blue-200 rounded text-[11px] font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  + Kemeja Putih
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('Celana Panjang SMP/SMA', 'Celana', 65000, 80000, 'Pcs')}
                  className="px-2 py-1 bg-white border border-blue-200 rounded text-[11px] font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  + Celana Panjang
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('Rok Rempel Sekolah', 'Rok', 62000, 78000, 'Pcs')}
                  className="px-2 py-1 bg-white border border-blue-200 rounded text-[11px] font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  + Rok Rempel
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('Topi Bordir Logo', 'Topi', 12000, 18000, 'Pcs')}
                  className="px-2 py-1 bg-white border border-blue-200 rounded text-[11px] font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  + Topi Logo
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('Dasi Sekolah', 'Dasi', 8000, 12000, 'Pcs')}
                  className="px-2 py-1 bg-white border border-blue-200 rounded text-[11px] font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  + Dasi
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('Ikat Pinggang Logam', 'Ikat Pinggang', 10000, 15000, 'Pcs')}
                  className="px-2 py-1 bg-white border border-blue-200 rounded text-[11px] font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  + Gesper
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitAdd} className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Barang <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Contoh: Kemeja Putih Pendek Bordir OSIS"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kategori <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.kategori}
                    onChange={(e) =>
                      setFormData({ ...formData, kategori: e.target.value as ProductCategory })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Satuan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.satuan}
                    onChange={(e) =>
                      setFormData({ ...formData, satuan: e.target.value as ProductUnit })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Ukuran <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.ukuran}
                    onChange={(e) => setFormData({ ...formData, ukuran: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {SIZES.map((sz) => (
                      <option key={sz} value={sz}>
                        {sz}
                      </option>
                    ))}
                    <option value="Lainnya">Lainnya (Ketik Manual)...</option>
                  </select>
                </div>

                {formData.ukuran === 'Lainnya' && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Ketik Ukuran Khusus <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customUkuran}
                      onChange={(e) => setFormData({ ...formData, customUkuran: e.target.value })}
                      placeholder="Contoh: No. 7 / Jumbo"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Stok Awal Fisik <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stokAwal}
                    onChange={(e) => setFormData({ ...formData, stokAwal: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Harga Beli / Modal (Rp) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.hargaBeli}
                    onChange={(e) => setFormData({ ...formData, hargaBeli: e.target.value })}
                    placeholder="Contoh: 50000"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Harga Jual Kasir (Rp) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.hargaJual}
                    onChange={(e) => setFormData({ ...formData, hargaJual: e.target.value })}
                    placeholder="Contoh: 65000"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Keterangan / Bahan</label>
                <input
                  type="text"
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  placeholder="Contoh: Bahan Famatex rempel rapi"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 px-4 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition-all"
                >
                  Simpan Barang Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Barang */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800">
                  Edit Data Barang ({editingProduct.id})
                </h3>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Barang <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) =>
                      setFormData({ ...formData, kategori: e.target.value as ProductCategory })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ukuran</label>
                  <select
                    value={formData.ukuran}
                    onChange={(e) => setFormData({ ...formData, ukuran: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {SIZES.map((sz) => (
                      <option key={sz} value={sz}>
                        {sz}
                      </option>
                    ))}
                    <option value="Lainnya">Lainnya...</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Harga Beli (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.hargaBeli}
                    onChange={(e) => setFormData({ ...formData, hargaBeli: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Harga Jual (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.hargaJual}
                    onChange={(e) => setFormData({ ...formData, hargaJual: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Keterangan</label>
                <input
                  type="text"
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800">
                <span className="font-semibold">Catatan Stok:</span> Stok akhir saat ini adalah{' '}
                <strong>
                  {editingProduct.stokAkhir} {editingProduct.satuan}
                </strong>
                . Perubahan stok harus dilakukan melalui menu <strong>Stok Masuk</strong> atau{' '}
                <strong>Stok Keluar</strong> untuk menjaga integritas mutasi riwayat.
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-2.5 px-4 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition-all"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Konfirmasi Hapus Barang */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <div className="p-3 bg-rose-100 rounded-full">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Konfirmasi Hapus Barang</h3>
                <p className="text-xs text-slate-500">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
              Apakah Anda yakin ingin menghapus barang{' '}
              <strong className="text-slate-900 font-semibold">
                "{deletingProduct.nama} ({deletingProduct.ukuran})"
              </strong>{' '}
              dengan kode <code className="font-mono text-blue-700 bg-blue-50 px-1 rounded">{deletingProduct.id}</code>?
            </p>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="flex-1 py-2.5 px-4 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 px-4 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold shadow-sm transition-all cursor-pointer"
              >
                Ya, Hapus Barang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
