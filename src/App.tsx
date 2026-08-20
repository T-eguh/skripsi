import React, { useState, useEffect, useCallback } from 'react';
import { User, Product, Transaction, StockIn, StockOut, CooperativeProfile } from './types';
import { StorageService } from './services/storage';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { DataBarangView } from './components/DataBarangView';
import { KasirView } from './components/KasirView';
import { StokMasukView } from './components/StokMasukView';
import { StokKeluarView } from './components/StokKeluarView';
import { LaporanPenjualanView } from './components/LaporanPenjualanView';
import { LaporanStokView } from './components/LaporanStokView';
import { ResearchDocView } from './components/ResearchDocView';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // State data from storage
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stockInHistory, setStockInHistory] = useState<StockIn[]>([]);
  const [stockOutHistory, setStockOutHistory] = useState<StockOut[]>([]);
  const [profile, setProfile] = useState<CooperativeProfile>(StorageService.getProfile());

  // Load state from Storage
  const loadAllData = useCallback(() => {
    StorageService.init();
    setProducts(StorageService.getProducts());
    setTransactions(StorageService.getTransactions());
    setStockInHistory(StorageService.getStockInHistory());
    setStockOutHistory(StorageService.getStockOutHistory());
    setProfile(StorageService.getProfile());
    setCurrentUser(StorageService.getCurrentUser());
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
    loadAllData();
  };

  const handleLogout = () => {
    StorageService.logout();
    setCurrentUser(null);
  };

  // If user is not logged in, show Login Screen
  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} profile={profile} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row text-slate-900">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        profile={profile}
        onLogout={handleLogout}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Bar Header */}
        <TopBar
          currentUser={currentUser}
          profile={profile}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* View Router */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              products={products}
              transactions={transactions}
              profile={profile}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'barang' && (
            <DataBarangView
              products={products}
              currentUser={currentUser}
              onRefresh={loadAllData}
            />
          )}

          {activeTab === 'kasir' && (
            <KasirView
              products={products}
              currentUser={currentUser}
              profile={profile}
              onTransactionSuccess={loadAllData}
            />
          )}

          {activeTab === 'stok-masuk' && (
            <StokMasukView
              products={products}
              stockInHistory={stockInHistory}
              currentUser={currentUser}
              onRefresh={loadAllData}
            />
          )}

          {activeTab === 'stok-keluar' && (
            <StokKeluarView
              products={products}
              stockOutHistory={stockOutHistory}
              currentUser={currentUser}
              onRefresh={loadAllData}
            />
          )}

          {activeTab === 'laporan-penjualan' && (
            <LaporanPenjualanView transactions={transactions} profile={profile} />
          )}

          {activeTab === 'laporan-stok' && (
            <LaporanStokView products={products} profile={profile} />
          )}

          {activeTab === 'bab4-pengujian' && (
            <ResearchDocView setActiveTab={setActiveTab} onRefreshData={loadAllData} />
          )}
        </main>
      </div>

      {/* Settings & Backup Modal */}
      <SettingsModal
        profile={profile}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onProfileUpdated={(updated) => setProfile(updated)}
        onResetData={loadAllData}
      />
    </div>
  );
}
