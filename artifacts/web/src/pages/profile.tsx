import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon, Award, MessageSquare, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Link } from 'wouter';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="h-full flex flex-col bg-background overflow-y-auto">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4 md:px-8 md:py-6">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight flex items-center gap-3">
          <UserIcon className="text-primary w-8 h-8" />
          Profil
        </h1>
      </header>

      <div className="p-4 md:p-8 pb-24 md:pb-8 max-w-2xl mx-auto w-full space-y-6">
        
        {/* Profile Card */}
        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden">
          {user.isPremium && (
            <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-[10px] font-black uppercase px-6 py-1 rotate-45 translate-x-6 translate-y-3 shadow-lg">
              Premium
            </div>
          )}
          
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-black text-white mb-4 shadow-xl shadow-primary/20">
            {user.displayName.substring(0,2).toUpperCase()}
          </div>
          
          <h2 className="text-2xl font-bold">{user.displayName}</h2>
          <p className="text-muted-foreground">{user.email}</p>

          <div className="flex items-center gap-8 mt-8 w-full justify-center">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-primary">{user.totalVotes}</span>
              <span className="text-xs uppercase font-bold text-muted-foreground flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3 h-3" /> Oy
              </span>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-secondary">{user.totalMessages}</span>
              <span className="text-xs uppercase font-bold text-muted-foreground flex items-center gap-1 mt-1">
                <MessageSquare className="w-3 h-3" /> Mesaj
              </span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-accent" />
            Rozetler
          </h3>
          {user.badges.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.badges.map(b => (
                <div key={b} className="bg-background border border-border px-4 py-2 rounded-xl flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-sm">{b}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Henüz rozet kazanmadın. Tartışmalara katıl!</p>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {user.isAdmin && (
            <Link href="/admin">
              <Button variant="outline" className="w-full h-12 font-bold justify-start gap-3 border-accent text-accent hover:bg-accent/10">
                <ShieldAlert className="w-5 h-5" />
                Admin Paneli
              </Button>
            </Link>
          )}
          <Button variant="destructive" onClick={logout} className="w-full h-12 font-bold justify-start gap-3">
            <LogOut className="w-5 h-5" />
            Çıkış Yap
          </Button>
        </div>

      </div>
    </div>
  );
}
