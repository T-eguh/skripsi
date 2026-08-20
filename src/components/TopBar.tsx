import React from 'react';
import { Menu, ShoppingCart, BookOpenCheck } from 'lucide-react';
import { User, CooperativeProfile } from '../types';
import { ActiveTab } from './Sidebar';

interface TopBarProps {
  currentUser: User;
  profile: CooperativeProfile;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenMobileMenu: () => void;
  onOpenSettings: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentUser,
  profile,
  activeTab,
  setActiveTab,
  onOpenMobileMenu,
}) => {
  const getPageTitle = (tab: ActiveTab) => {
    switch (tab) {
      case 'dashboard':
        return 'Dashboard & Ringkasan Koperasi';
      case 'barang':
        return 'Pengelolaan Data Barang Seragam & Atribut';
      case 'kasir':
        return 'Kasir Penjualan / Point of Sale';
      case 'stok-masuk':
        return 'Pencatatan Stok Masuk (Pengadaan)';
      case 'stok-keluar':
        return 'Pencatatan Stok Keluar (Cacat / Retur)';
      case 'laporan-penjualan':
        return 'Laporan Rekapitulasi Penjualan';
      case 'laporan-stok':
        return 'Laporan Mutasi & Saldo Stok';
      case 'bab4-pengujian':
        return 'Dokumentasi Bab 4 & Pengujian Sistem';
      default:
        return 'Sistem Koperasi';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200/80 px-4 sm:px-6 py-3 no-print">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Button & Brand / Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
            aria-label="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight truncate">
              {getPageTitle(activeTab)}
            </h2>
            <p className="text-xs text-slate-500 hidden sm:block">
              {profile.namaSekolah}
            </p>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-2.5">
          {activeTab !== 'kasir' && (
            <button
              onClick={() => setActiveTab('kasir')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors whitespace-nowrap shrink-0"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Buka Kasir</span>
            </button>
          )}

          {activeTab !== 'bab4-pengujian' && (
            <button
              onClick={() => setActiveTab('bab4-pengujian')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0"
            >
              <BookOpenCheck className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">Uji Bab 4</span>
            </button>
          )}

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* User Quick Info */}
          <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-700">
              {currentUser.username}
            </span>
            <span className="text-[10px] text-slate-500 uppercase px-1.5 py-0.5 bg-slate-200/80 rounded font-bold">
              {currentUser.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
