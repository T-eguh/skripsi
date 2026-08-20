import React, { useState } from 'react';
import { StorageService } from '../services/storage';
import { User, CooperativeProfile } from '../types';
import { School, Lock, User as UserIcon, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
  profile: CooperativeProfile;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, profile }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      if (!username.trim() || !password.trim()) {
        throw new Error('Username dan password wajib diisi.');
      }
      const user = StorageService.login(username, password);
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess(user);
      }, 200);
    } catch (err: unknown) {
      setIsLoading(false);
      setErrorMessage((err as Error).message || 'Gagal login ke sistem.');
    }
  };

  const handleQuickLogin = (demoUser: 'admin' | 'kasir') => {
    if (demoUser === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    } else {
      setUsername('kasir');
      setPassword('kasir123');
    }
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100">
      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-xl shadow-blue-500/20 text-white mb-3">
            <School className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {profile.namaKoperasi}
          </h1>
          <p className="text-sm text-blue-300 font-medium mt-1">
            {profile.namaSekolah}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            Sistem Informasi Pengelolaan Seragam & Atribut Sekolah
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-100">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">Masuk ke Sistem</h2>
            <p className="text-xs text-slate-500 mt-1">
              Gunakan akun pengurus koperasi sekolah yang telah terdaftar.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Gagal Masuk: </span>
                {errorMessage}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Username Pengurus
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: admin atau kasir"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password akun"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg text-sm shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? (
                <span>Memverifikasi akun...</span>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Account Quick Switch (For Testing & Sidang Presentation) */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Akun Demo Pengujian (Bab 4)
              </span>
              <span className="text-[10px] text-blue-600 font-semibold">1-Klik Isi Form</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-left transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 group-hover:text-blue-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Pengurus 1 (Admin)</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-mono">
                  user: <strong className="text-slate-700">admin</strong>
                  <br />
                  pass: <strong className="text-slate-700">admin123</strong>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('kasir')}
                className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                  <UserIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pengurus 2 (Kasir)</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-mono">
                  user: <strong className="text-slate-700">kasir</strong>
                  <br />
                  pass: <strong className="text-slate-700">kasir123</strong>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-slate-400">
          <p>Sistem Informasi Koperasi Sekolah &copy; 2026</p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Dibuat untuk Keperluan Penelitian / Tugas Akhir Pengembangan Sistem
          </p>
        </div>
      </div>
    </div>
  );
};
