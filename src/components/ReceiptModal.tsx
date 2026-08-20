import React, { useRef } from 'react';
import { Transaction, CooperativeProfile } from '../types';
import { formatRupiah, formatDateTime } from '../utils/formatters';
import { Printer, X, CheckCircle2 } from 'lucide-react';

interface ReceiptModalProps {
  transaction: Transaction;
  profile: CooperativeProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  profile,
  isOpen,
  onClose,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header (No Print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-800">Struk Transaksi Berhasil</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Area */}
        <div ref={receiptRef} className="p-6 bg-white printable-area text-slate-800 font-sans">
          {/* Header Struk */}
          <div className="text-center pb-4 border-b border-dashed border-slate-300">
            <h2 className="text-base font-bold uppercase tracking-wide text-slate-900">
              {profile.namaKoperasi}
            </h2>
            <p className="text-xs font-semibold text-slate-700">{profile.namaSekolah}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{profile.alamat}</p>
            <p className="text-[11px] text-slate-500">Telp: {profile.telepon}</p>
          </div>

          {/* Info Transaksi */}
          <div className="py-3 border-b border-dashed border-slate-300 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">No. Nota:</span>
              <span className="font-mono font-bold text-slate-800">{transaction.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Waktu:</span>
              <span className="text-slate-700">{formatDateTime(transaction.tanggal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Kasir:</span>
              <span className="text-slate-700 font-medium">{transaction.kasir}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Pembeli:</span>
              <span className="text-slate-800 font-medium">
                {transaction.namaPembeli} ({transaction.kelas})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Metode Bayar:</span>
              <span className="text-slate-700 font-semibold">{transaction.metodeBayar}</span>
            </div>
          </div>

          {/* Item Belanja */}
          <div className="py-3 border-b border-dashed border-slate-300">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Daftar Seragam / Atribut
            </div>
            <div className="space-y-2.5">
              {transaction.items.map((item, idx) => (
                <div key={idx} className="text-xs">
                  <div className="font-semibold text-slate-800 flex justify-between">
                    <span>
                      {item.namaBarang} <span className="text-blue-600">({item.ukuran})</span>
                    </span>
                    <span>{formatRupiah(item.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px] mt-0.5">
                    <span>
                      {item.jumlah} x {formatRupiah(item.harga)}
                    </span>
                    <span className="font-mono text-slate-400">#{item.idBarang}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total & Pembayaran */}
          <div className="py-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-1">
              <span>TOTAL BELANJA</span>
              <span className="text-blue-700">{formatRupiah(transaction.total)}</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Uang Diterima ({transaction.metodeBayar})</span>
              <span>{formatRupiah(transaction.bayar)}</span>
            </div>
            <div className="flex justify-between text-slate-700 font-semibold">
              <span>Kembalian</span>
              <span>{formatRupiah(transaction.kembali)}</span>
            </div>
          </div>

          {/* Footer Struk */}
          <div className="pt-4 border-t border-dashed border-slate-300 text-center space-y-1">
            <p className="text-[11px] text-slate-600 italic leading-relaxed">
              "{profile.pesanStruk}"
            </p>
            <p className="text-[10px] text-slate-400 pt-1">
              Barang yang sudah dibeli dapat ditukar ukuran maksimal 3 hari (bawa nota ini).
            </p>
          </div>
        </div>

        {/* Modal Actions (No Print) */}
        <div className="flex gap-3 p-4 bg-slate-50 border-t border-slate-100 no-print">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-2.5 px-4 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            Cetak Struk / Nota
          </button>
        </div>
      </div>
    </div>
  );
};
