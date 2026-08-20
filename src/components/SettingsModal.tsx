import React, { useState } from 'react';
import { CooperativeProfile } from '../types';
import { StorageService } from '../services/storage';
import {
  X,
  Building2,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  ShieldCheck,
} from 'lucide-react';

interface SettingsModalProps {
  profile: CooperativeProfile;
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: (profile: CooperativeProfile) => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  profile,
  isOpen,
  onClose,
  onProfileUpdated,
  onResetData,
}) => {
  const [formData, setFormData] = useState<CooperativeProfile>({ ...profile });
  const [isSaved, setIsSaved] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.updateProfile(formData);
    onProfileUpdated(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleDownloadBackup = () => {
    const jsonStr = StorageService.exportAllToJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Backup_Database_Koperasi_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    StorageService.resetToDefault();
    onResetData();
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800">Pengaturan Koperasi & Backup Data</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs sm:text-sm">
          {isSaved && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profil Koperasi Sekolah berhasil diperbarui!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Koperasi Sekolah</label>
              <input
                type="text"
                required
                value={formData.namaKoperasi}
                onChange={(e) => setFormData({ ...formData, namaKoperasi: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Lembaga / Sekolah</label>
              <input
                type="text"
                required
                value={formData.namaSekolah}
                onChange={(e) => setFormData({ ...formData, namaSekolah: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Alamat Sekolah</label>
                <input
                  type="text"
                  required
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">No. Telepon / Kontak</label>
                <input
                  type="text"
                  required
                  value={formData.telepon}
                  onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ketua Koperasi</label>
                <input
                  type="text"
                  required
                  value={formData.ketuaKoperasi}
                  onChange={(e) => setFormData({ ...formData, ketuaKoperasi: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">NIP Ketua</label>
                <input
                  type="text"
                  value={formData.nipKetua || ''}
                  onChange={(e) => setFormData({ ...formData, nipKetua: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Pesan Kaki Struk Kasir</label>
              <input
                type="text"
                value={formData.pesanStruk}
                onChange={(e) => setFormData({ ...formData, pesanStruk: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-xs transition-colors cursor-pointer"
            >
              Simpan Profil Koperasi
            </button>
          </form>

          {/* Backup & Reset Database Section */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              Manajemen Data Penelitian (Backup & Reset)
            </h4>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleDownloadBackup}
                className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Backup JSON Database</span>
              </button>

              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="flex-1 py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset ke Data Demo Awal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Reset Confirmation Sub-Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-5 border border-slate-200 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-3 text-rose-600 mb-3">
                <AlertTriangle className="w-6 h-6" />
                <h4 className="font-bold text-slate-900 text-sm">Konfirmasi Reset Database</h4>
              </div>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Apakah Anda yakin ingin mengembalikan seluruh data (Barang, Transaksi, Stok Masuk/Keluar) ke data demo bawaan penelitian?
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 py-2 rounded-lg bg-rose-600 text-xs font-semibold text-white hover:bg-rose-700"
                >
                  Ya, Reset Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
