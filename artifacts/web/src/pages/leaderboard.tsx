import React from 'react';
import { Trophy, Medal, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const MOCK_LEADERS = [
  { id: 'u1', name: 'Alparslan', votes: 1432, msgs: 5432, badges: ['Efsane', 'Yenilmez'] },
  { id: 'u2', name: 'ZeynepK', votes: 1245, msgs: 4210, badges: ['Aktif'] },
  { id: 'u3', name: 'DarkKnight', votes: 1102, msgs: 3980, badges: [] },
  { id: 'u4', name: 'Cem_B', votes: 980, msgs: 2100, badges: ['Sakin'] },
  { id: 'u5', name: 'ElifNur', votes: 890, msgs: 1850, badges: [] },
  { id: 'u6', name: 'Baris34', votes: 850, msgs: 1600, badges: [] },
  { id: 'u7', name: 'Aysgl', votes: 720, msgs: 1420, badges: [] },
  { id: 'u8', name: 'HakanY', votes: 690, msgs: 1200, badges: [] },
  { id: 'u9', name: 'DenizD', votes: 550, msgs: 980, badges: [] },
  { id: 'u10', name: 'Kaan_01', votes: 420, msgs: 850, badges: [] },
];

export default function LeaderboardPage() {
  const { user } = useAuth();

  return (
    <div className="h-full flex flex-col bg-background overflow-y-auto">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4 md:px-8 md:py-6">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight flex items-center gap-3">
          <Trophy className="text-accent w-8 h-8" />
          Sıralama
        </h1>
        <p className="text-muted-foreground text-sm font-medium mt-1">En ateşli tartışmacılar</p>
      </header>

      <div className="p-4 md:p-8 pb-24 md:pb-8 max-w-4xl mx-auto w-full">
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
          {MOCK_LEADERS.map((leader, index) => {
            const isMe = user?.displayName === leader.name;
            const isTop3 = index < 3;
            
            let MedalIcon = null;
            let medalColor = '';
            
            if (index === 0) { MedalIcon = Medal; medalColor = 'text-yellow-400'; }
            else if (index === 1) { MedalIcon = Medal; medalColor = 'text-gray-300'; }
            else if (index === 2) { MedalIcon = Medal; medalColor = 'text-amber-600'; }

            return (
              <div 
                key={leader.id}
                className={`flex items-center gap-4 p-4 border-b border-border last:border-0 transition-colors ${
                  isMe ? 'bg-primary/10' : 'hover:bg-muted/50'
                }`}
              >
                <div className="w-8 flex justify-center font-black text-lg text-muted-foreground">
                  {isTop3 && MedalIcon ? (
                    <MedalIcon className={`w-6 h-6 ${medalColor}`} />
                  ) : (
                    `#${index + 1}`
                  )}
                </div>

                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center font-bold text-foreground">
                  {leader.name.substring(0, 2).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg truncate">{leader.name}</h3>
                    {isMe && <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-bold uppercase">Sen</span>}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {leader.votes} Oy</span>
                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {leader.msgs} Mesaj</span>
                  </div>
                </div>

                {leader.badges.length > 0 && (
                  <div className="hidden md:flex gap-1">
                    {leader.badges.map(b => (
                      <span key={b} className="px-2 py-1 bg-background border border-border text-[10px] uppercase font-bold rounded-md text-primary">
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
