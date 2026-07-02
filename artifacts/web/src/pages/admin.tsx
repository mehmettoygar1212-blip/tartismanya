import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Redirect } from 'wouter';
import { ShieldAlert, BarChart3, Users, MessageSquare, AlertTriangle } from 'lucide-react';

type Tab = 'istatistik' | 'kullanici' | 'sikayet';

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('istatistik');

  if (!user?.isAdmin) {
    return <Redirect href="/rooms" />;
  }

  const handleAction = (msg: string) => {
    if (window.confirm(`${msg} işlemini onaylıyor musunuz?`)) {
      alert('İşlem başarılı.');
    }
  };

  return (
    <div className="h-full flex flex-col bg-background overflow-y-auto">
      <header className="sticky top-0 z-10 bg-card border-b border-border px-4 py-4 md:px-8 md:py-6">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight flex items-center gap-3 text-accent">
          <ShieldAlert className="w-8 h-8" />
          Komuta Merkezi
        </h1>
        <p className="text-muted-foreground text-sm font-medium mt-1">Sistem yönetimi ve moderasyon</p>
      </header>

      <div className="p-4 md:p-8 pb-24 md:pb-8 flex-1">
        {/* Pill Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          <button
            onClick={() => setActiveTab('istatistik')}
            className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'istatistik' ? 'bg-primary text-white' : 'bg-card border border-border text-muted-foreground'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> İstatistikler
          </button>
          <button
            onClick={() => setActiveTab('kullanici')}
            className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'kullanici' ? 'bg-primary text-white' : 'bg-card border border-border text-muted-foreground'
            }`}
          >
            <Users className="w-4 h-4" /> Kullanıcılar
          </button>
          <button
            onClick={() => setActiveTab('sikayet')}
            className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'sikayet' ? 'bg-primary text-white' : 'bg-card border border-border text-muted-foreground'
            }`}
          >
            <AlertTriangle className="w-4 h-4" /> Şikayetler
          </button>
        </div>

        <div className="mt-4">
          {activeTab === 'istatistik' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card border border-border p-6 rounded-2xl">
                <p className="text-sm text-muted-foreground font-bold uppercase mb-2">Toplam Kullanıcı</p>
                <p className="text-4xl font-black">12,492</p>
                <p className="text-xs text-primary mt-2">+124 bugün</p>
              </div>
              <div className="bg-card border border-border p-6 rounded-2xl">
                <p className="text-sm text-muted-foreground font-bold uppercase mb-2">Atılan Mesaj</p>
                <p className="text-4xl font-black">1.2M</p>
                <p className="text-xs text-secondary mt-2">aktif akış</p>
              </div>
              <div className="bg-card border border-border p-6 rounded-2xl">
                <p className="text-sm text-muted-foreground font-bold uppercase mb-2">Aktif Odalar</p>
                <p className="text-4xl font-black">10</p>
                <p className="text-xs text-accent mt-2">hepsi yayında</p>
              </div>
            </div>
          )}

          {activeTab === 'kullanici' && (
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/30">
                <h3 className="font-bold">Son Aktif Kullanıcılar</h3>
              </div>
              <div className="divide-y divide-border">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold">User_{8000 + i}</p>
                      <p className="text-xs text-muted-foreground">user{i}@test.com</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleAction('Susturma')} className="px-3 py-1 bg-secondary/20 text-secondary text-xs font-bold rounded hover:bg-secondary/30">Sustur</button>
                      <button onClick={() => handleAction('Ban')} className="px-3 py-1 bg-destructive/20 text-destructive text-xs font-bold rounded hover:bg-destructive/30">Banla</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sikayet' && (
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/30">
                <h3 className="font-bold">Raporlanan Mesajlar</h3>
              </div>
              <div className="divide-y divide-border">
                {[1,2,3].map(i => (
                  <div key={i} className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between">
                      <p className="text-xs font-bold text-destructive">Şikayet Nedeni: Hakaret</p>
                      <p className="text-xs text-muted-foreground">Oda: Futbol</p>
                    </div>
                    <div className="bg-background p-3 rounded-lg border border-border">
                      <p className="text-sm">"Hakem zaten taraf tutuyordu..."</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Gönderen: Fanatik34</p>
                    </div>
                    <div className="flex gap-2 justify-end mt-1">
                      <button onClick={() => handleAction('Reddet')} className="px-3 py-1 bg-muted text-muted-foreground text-xs font-bold rounded">İptal</button>
                      <button onClick={() => handleAction('Mesajı Sil')} className="px-3 py-1 bg-destructive text-white text-xs font-bold rounded">Mesajı Sil</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
