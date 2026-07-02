import React from 'react';
import { Link, useLocation } from 'wouter';
import { MessageSquare, LayoutGrid, Trophy, User, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user } = useAuth();

  const navItems = [
    { href: '/rooms', label: 'Odalar', icon: LayoutGrid },
    { href: '/leaderboard', label: 'Sıralama', icon: Trophy },
    { href: '/profile', label: 'Profil', icon: User },
  ];

  if (user?.isAdmin) {
    navItems.push({ href: '/admin', label: 'Admin', icon: ShieldAlert });
  }

  // If we are on a room detail page, we hide the sidebar/bottom nav to give full screen to the arena
  const isArena = location.startsWith('/room/');

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      {!isArena && (
        <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card p-4">
          <div className="flex items-center gap-2 px-2 py-4 mb-6">
            <div className="bg-primary/20 p-2 rounded-xl">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold font-sans tracking-tight">Tartışmanya</h1>
          </div>
          
          <nav className="flex-1 flex flex-col gap-2">
            {navItems.map((item) => {
              const active = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    data-testid={`nav-${item.href.replace('/', '')}`}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all cursor-pointer ${
                      active
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-4 border-t border-border px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-white uppercase shadow-lg">
                {user?.displayName.substring(0, 2)}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold truncate w-32">{user?.displayName}</span>
                <span className="text-xs text-muted-foreground truncate w-32">{user?.email}</span>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-[100dvh] overflow-hidden">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      {!isArena && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-card/80 backdrop-blur-xl pb-safe z-50">
          <div className="flex items-center justify-around p-2">
            {navItems.map((item) => {
              const active = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    data-testid={`mobilenav-${item.href.replace('/', '')}`}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                      active ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    <item.icon className={`w-6 h-6 ${active ? 'fill-primary/20' : ''}`} />
                    <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
