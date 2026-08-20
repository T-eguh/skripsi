import React from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  FileSpreadsheet,
  BookOpenCheck,
  LogOut,
  Settings,
  Shield,
  UserCheck,
  School,
} from 'lucide-react';
import { User, CooperativeProfile } from '../types';

export type ActiveTab =
  | 'dashboard'
  | 'barang'
  | 'kasir'
  | 'stok-masuk'
  | 'stok-keluar'
  | 'laporan-penjualan'
  | 'laporan-stok'
  | 'bab4-pengujian';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: User;
  profile: CooperativeProfile;
  onLogout: () => void;
  onOpenSettings: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  profile,
  onLogout,
  onOpenSettings,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'kasir'],
    },
    {
      id: 'barang' as ActiveTab,
      label: 'Data Barang',
      icon: Package,
      roles: ['admin', 'kasir'],
    },
    {
      id: 'kasir' as ActiveTab,
      label: 'Kasir Penjualan',
      icon: ShoppingCart,
      roles: ['admin', 'kasir'],
    },
    {
      id: 'stok-masuk' as ActiveTab,
      label: 'Stok Masuk',
      icon: ArrowDownLeft,
      roles: ['admin', 'kasir'],
    },
    {
      id: 'stok-keluar' as ActiveTab,
      label: 'Stok Keluar',
      icon: ArrowUpRight,
      roles: ['admin', 'kasir'],
    },
    {
      id: 'laporan-penjualan' as ActiveTab,
      label: 'Laporan Penjualan',
      icon: Receipt,
      roles: ['admin', 'kasir'],
    },
    {
      id: 'laporan-stok' as ActiveTab,
      label: 'Laporan Stok',
      icon: FileSpreadsheet,
      roles: ['admin', 'kasir'],
    },
    {
      id: 'bab4-pengujian' as ActiveTab,
      label: 'Dokumentasi & Uji Bab 4',
      icon: BookOpenCheck,
      badge: 'Skripsi',
      roles: ['admin', 'kasir'],
    },
  ];

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            <School className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <h1 className="font-bold text-sm text-white truncate tracking-tight">
              {profile.namaKoperasi}
            </h1>
            <p className="text-xs text-blue-400 font-medium truncate">
              Seragam & Atribut Sekolah
            </p>
          </div>
        </div>

        {/* User Card */}
        <div className="mx-4 my-4 p-3 rounded-xl bg-slate-800/80 border border-slate-750">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm shrink-0">
              {currentUser.role === 'admin' ? (
                <Shield className="w-4 h-4" />
              ) : (
                <UserCheck className="w-4 h-4" />
              )}
            </div>
            <div className="overflow-hidden flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200 truncate block">
                  {currentUser.nama.split('(')[0].trim()}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    currentUser.role === 'admin' ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                />
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  {currentUser.role === 'admin' ? 'Pengurus 1 (Admin)' : 'Pengurus 2 (Kasir)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Menu Utama
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                      isActive ? 'bg-white/20 text-white' : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Settings & Logout */}
        <div className="p-3 border-t border-slate-800 space-y-1">
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Info & Backup Data</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-rose-300 hover:text-rose-200 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>
    </>
  );
};
