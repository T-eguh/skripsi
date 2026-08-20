import React, { useState } from 'react';
import { Product, User, CooperativeProfile, Transaction, CartItem } from '../types';
import { StorageService } from '../services/storage';
import { formatRupiah } from '../utils/formatters';
import {
  ShoppingCart,
  Search,
  Plus,
  Minus,
  Trash2,
  AlertCircle,
  CreditCard,
  Banknote,
  School,
  X,
  Receipt,
  Layers,
} from 'lucide-react';
import { ReceiptModal } from './ReceiptModal';

interface KasirViewProps {
  products: Product[];
  currentUser: User;
  profile: CooperativeProfile;
  onTransactionSuccess: () => void;
}

export const KasirView: React.FC<KasirViewProps> = ({
  products,
  currentUser,
  profile,
  onTransactionSuccess,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // Transaction form fields
  const [namaPembeli, setNamaPembeli] = useState('');
  const [kelas, setKelas] = useState('VII-A');
  const [customKelas, setCustomKelas] = useState('');
  const [metodeBayar, setMetodeBayar] = useState<'Tunai' | 'QRIS / Transfer'>('Tunai');
  const [nominalBayar, setNominalBayar] = useState<string>('');
  const [catatan, setCatatan] = useState('');

  // Error & Modal state
  const [errorMessage, setErrorMessage] = useState('');
  const [recentTransaction, setRecentTransaction] = useState<Transaction | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const categories = ['Semua', 'Seragam', 'Celana', 'Rok', 'Topi', 'Dasi', 'Ikat Pinggang', 'Atribut', 'Kaos Kaki', 'Lainnya'];
  const commonClasses = ['VII-A', 'VII-B', 'VII-C', 'VIII-A', 'VIII-B', 'VIII-C', 'IX-A', 'IX-B', 'IX-C', 'X MIPA 1', 'X IPS 1', 'XI MIPA 1', 'XII MIPA 1', 'Guru/Staf', 'Umum/Lainnya'];

  // Filter Catalog
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ukuran.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || p.kategori === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate Cart Grand Total
  const totalBelanja = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const totalItemCount = cart.reduce((sum, item) => sum + item.jumlah, 0);
  const bayarValue = Number(nominalBayar) || 0;
  const kembalian = metodeBayar === 'Tunai' ? Math.max(0, bayarValue - totalBelanja) : 0;

  // Add Item to Cart with Real-time Stock Limit Protection
  const handleAddToCart = (product: Product) => {
    setErrorMessage('');

    // Check if product is out of stock
    if (product.stokAkhir <= 0) {
      setErrorMessage(`Barang "${product.nama} (${product.ukuran})" sudah HABIS.`);
      return;
    }

    const existingIndex = cart.findIndex((item) => item.product.id === product.id);

    if (existingIndex > -1) {
      const currentQty = cart[existingIndex].jumlah;
      // VALIDATION: Cannot exceed available stock
      if (currentQty + 1 > product.stokAkhir) {
        setErrorMessage(
          `Stok tidak mencukupi. Sisa stok "${product.nama} (${product.ukuran})" hanya ${product.stokAkhir} ${product.satuan}.`
        );
        return;
      }

      const updatedCart = [...cart];
      const newQty = currentQty + 1;
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        jumlah: newQty,
        subtotal: newQty * product.hargaJual,
      };
      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          product,
          jumlah: 1,
          subtotal: product.hargaJual,
        },
      ]);
    }
  };

  // Update Item Quantity in Cart
  const handleUpdateQty = (productId: string, newQty: number) => {
    setErrorMessage('');
    const targetItem = cart.find((item) => item.product.id === productId);
    if (!targetItem) return;

    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }

    // VALIDATION: Stock constraint check
    if (newQty > targetItem.product.stokAkhir) {
      setErrorMessage(
        `Stok tidak mencukupi! Sisa stok "${targetItem.product.nama}" hanya ${targetItem.product.stokAkhir} ${targetItem.product.satuan}.`
      );
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              jumlah: newQty,
              subtotal: newQty * item.product.hargaJual,
            }
          : item
      )
    );
  };

  // Remove Item from Cart
  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Clear Cart
  const handleClearCart = () => {
    setCart([]);
    setErrorMessage('');
    setNominalBayar('');
  };

  // Quick Money Preset
  const handlePresetMoney = (amount: number | 'PAS') => {
    if (amount === 'PAS') {
      setNominalBayar(String(totalBelanja));
    } else {
      setNominalBayar(String(amount));
    }
  };

  // Submit Transaction
  const handleProcessTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      if (cart.length === 0) {
        throw new Error('Keranjang belanja kosong! Pilih barang terlebih dahulu.');
      }
      if (!namaPembeli.trim()) {
        throw new Error('Silakan masukkan nama siswa / pembeli.');
      }

      const finalKelas = kelas === 'Umum/Lainnya' ? customKelas.trim() || 'Umum' : kelas;

      if (metodeBayar === 'Tunai' && bayarValue < totalBelanja) {
        throw new Error(`Uang pembayaran kurang! Total belanja: ${formatRupiah(totalBelanja)}, Uang diberikan: ${formatRupiah(bayarValue)}.`);
      }

      // Execute transaction via atomic storage service
      const newTrx = StorageService.createTransaction({
        namaPembeli: namaPembeli.trim(),
        kelas: finalKelas,
        kasir: `${currentUser.nama.split('(')[0].trim()} (${currentUser.username})`,
        bayar: metodeBayar === 'Tunai' ? bayarValue : totalBelanja,
        metodeBayar,
        catatan: catatan.trim(),
        items: cart.map((item) => ({
          productId: item.product.id,
          jumlah: item.jumlah,
        })),
      });

      // Reset form & trigger receipt
      setRecentTransaction(newTrx);
      setIsReceiptOpen(true);
      setCart([]);
      setNamaPembeli('');
      setNominalBayar('');
      setCatatan('');
      onTransactionSuccess();
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Gagal memproses transaksi.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* LEFT: Product Catalog (7 Cols) */}
      <div className="lg:col-span-7 space-y-4">
        {/* Search & Category Header */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <School className="w-4 h-4 text-blue-600" />
              <span>Katalog Seragam & Atribut Sekolah</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {filteredProducts.length} Produk
            </span>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ketik nama seragam, ukuran, atau kode barang..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredProducts.map((prod) => {
            const isOutOfStock = prod.stokAkhir <= 0;
            const inCart = cart.find((i) => i.product.id === prod.id);

            return (
              <div
                key={prod.id}
                onClick={() => !isOutOfStock && handleAddToCart(prod)}
                className={`bg-white rounded-xl border p-3.5 flex flex-col justify-between transition-all cursor-pointer select-none relative group ${
                  isOutOfStock
                    ? 'opacity-60 bg-slate-50 border-slate-200 cursor-not-allowed'
                    : inCart
                    ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                    : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                {/* Header Tag & Size */}
                <div className="flex items-start justify-between gap-1 mb-2">
                  <span className="text-[10px] font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                    #{prod.id}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                    {prod.ukuran}
                  </span>
                </div>

                {/* Name */}
                <div className="my-1">
                  <h3 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">
                    {prod.nama}
                  </h3>
                  <span className="text-[11px] text-slate-650 font-medium block mt-0.5">
                    {prod.kategori}
                  </span>
                </div>

                {/* Price & Stock */}
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-blue-700 font-mono block">
                      {formatRupiah(prod.hargaJual)}
                    </span>
                    <span
                      className={`text-[10px] font-semibold ${
                        isOutOfStock
                          ? 'text-rose-600'
                          : prod.stokAkhir <= 5
                          ? 'text-amber-600'
                          : 'text-slate-650'
                      }`}
                    >
                      {isOutOfStock ? 'Habis (0)' : `Stok: ${prod.stokAkhir} ${prod.satuan}`}
                    </span>
                  </div>

                  <button
                    disabled={isOutOfStock}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isOutOfStock
                        ? 'bg-slate-200 text-slate-400'
                        : inCart
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 group-hover:bg-blue-600 group-hover:text-white'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Badge if already in cart */}
                {inCart && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {inCart.jumlah}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center text-slate-400 border border-slate-200">
            <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-slate-600">Barang tidak ditemukan</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Coba cari dengan kata kunci lain atau pilih tab Semua Kategori.
            </p>
          </div>
        )}
      </div>

      {/* RIGHT: Cart & Checkout Form (5 Cols) */}
      <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 shadow-md p-5 space-y-4 sticky top-20">
        {/* Cart Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Keranjang Belanja</h2>
              <p className="text-[11px] text-slate-500">{totalItemCount} barang terpilih</p>
            </div>
          </div>
          {cart.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Kosongkan</span>
            </button>
          )}
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div className="flex-1">
              <strong className="font-semibold">Peringatan: </strong>
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage('')} className="text-rose-400 hover:text-rose-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Cart Items List */}
        <div className="max-h-[260px] overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-30 text-slate-400" />
              <p className="text-xs font-semibold text-slate-600">Keranjang masih kosong</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Pilih barang dari katalog di sebelah kiri untuk memulai transaksi.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2"
              >
                <div className="overflow-hidden flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {item.product.nama}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                      {item.product.ukuran}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {formatRupiah(item.product.hargaJual)} x {item.jumlah} ={' '}
                    <strong className="text-slate-800 font-semibold">
                      {formatRupiah(item.subtotal)}
                    </strong>
                  </div>
                </div>

                {/* Qty Counter */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleUpdateQty(item.product.id, item.jumlah - 1)}
                    className="w-6 h-6 rounded bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-7 text-center font-bold text-xs text-slate-800 font-mono">
                    {item.jumlah}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleUpdateQty(item.product.id, item.jumlah + 1)}
                    className="w-6 h-6 rounded bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.product.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 ml-0.5"
                    title="Hapus item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleProcessTransaction} className="space-y-3 pt-2 border-t border-slate-200">
          {/* Buyer Information */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Nama Pembeli / Siswa <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={namaPembeli}
                onChange={(e) => setNamaPembeli(e.target.value)}
                placeholder="Nama lengkap siswa"
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Kelas / Kategori <span className="text-rose-500">*</span>
              </label>
              <select
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-600 focus:outline-none"
              >
                {commonClasses.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {kelas === 'Umum/Lainnya' && (
            <div>
              <input
                type="text"
                required
                value={customKelas}
                onChange={(e) => setCustomKelas(e.target.value)}
                placeholder="Ketik status pembeli (contoh: Guru Matematika / Orang Tua Siswa)"
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
              />
            </div>
          )}

          {/* Payment Method Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Metode Pembayaran
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMetodeBayar('Tunai')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-colors ${
                  metodeBayar === 'Tunai'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Banknote className="w-3.5 h-3.5" />
                <span>Tunai (Cash)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMetodeBayar('QRIS / Transfer');
                  setNominalBayar(String(totalBelanja));
                }}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-colors ${
                  metodeBayar === 'QRIS / Transfer'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>QRIS / Transfer</span>
              </button>
            </div>
          </div>

          {/* Cash Payment Calculation */}
          {metodeBayar === 'Tunai' && (
            <div className="space-y-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-700">
                  Uang Tunai Diterima (Rp) <span className="text-rose-500">*</span>
                </label>
                {bayarValue > 0 && bayarValue >= totalBelanja && (
                  <span className="text-[11px] font-semibold text-emerald-600">
                    Kembali: {formatRupiah(kembalian)}
                  </span>
                )}
              </div>

              <input
                type="number"
                min="0"
                required
                value={nominalBayar}
                onChange={(e) => setNominalBayar(e.target.value)}
                placeholder="Contoh: 100000"
                className="w-full px-3 py-1.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded-md text-slate-900 focus:ring-1 focus:ring-blue-600 focus:outline-none"
              />

              {/* Fast Nominal Buttons */}
              <div className="flex flex-wrap gap-1 pt-1">
                <button
                  type="button"
                  onClick={() => handlePresetMoney('PAS')}
                  className="px-2 py-1 rounded bg-white border border-slate-300 text-[10px] font-bold text-blue-700 hover:bg-blue-50"
                >
                  Uang Pas
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetMoney(20000)}
                  className="px-2 py-1 rounded bg-white border border-slate-300 text-[10px] font-semibold text-slate-700 hover:bg-slate-100"
                >
                  20rb
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetMoney(50000)}
                  className="px-2 py-1 rounded bg-white border border-slate-300 text-[10px] font-semibold text-slate-700 hover:bg-slate-100"
                >
                  50rb
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetMoney(100000)}
                  className="px-2 py-1 rounded bg-white border border-slate-300 text-[10px] font-semibold text-slate-700 hover:bg-slate-100"
                >
                  100rb
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetMoney(200000)}
                  className="px-2 py-1 rounded bg-white border border-slate-300 text-[10px] font-semibold text-slate-700 hover:bg-slate-100"
                >
                  200rb
                </button>
              </div>
            </div>
          )}

          {/* Grand Total Bar */}
          <div className="p-3 bg-blue-900 text-white rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider block">
                Total Pembayaran
              </span>
              <span className="text-lg font-bold font-mono">{formatRupiah(totalBelanja)}</span>
            </div>
            {metodeBayar === 'Tunai' && bayarValue >= totalBelanja && (
              <div className="text-right">
                <span className="text-[10px] uppercase font-semibold text-blue-200 block">
                  Kembalian
                </span>
                <span className="text-sm font-bold font-mono text-emerald-300">
                  {formatRupiah(kembalian)}
                </span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={cart.length === 0}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Receipt className="w-4 h-4" />
            <span>Selesaikan & Cetak Struk</span>
          </button>
        </form>
      </div>

      {/* Receipt Modal */}
      {recentTransaction && (
        <ReceiptModal
          transaction={recentTransaction}
          profile={profile}
          isOpen={isReceiptOpen}
          onClose={() => setIsReceiptOpen(false)}
        />
      )}
    </div>
  );
};
