import React from 'react';
import { ROOMS } from '@/lib/rooms';
import { Link } from 'wouter';
import * as Icons from 'lucide-react';
import { Users, Activity } from 'lucide-react';

export default function RoomsPage() {
  const totalUsers = ROOMS.reduce((acc, r) => acc + r.activeUsers, 0);

  return (
    <div className="h-full flex flex-col bg-background overflow-y-auto">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4 md:px-8 md:py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Arenalar</h1>
            <p className="text-muted-foreground text-sm font-medium mt-1">Hangi konuda tartışmak istersin?</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-xl">
              <Activity className="w-4 h-4 text-primary animate-pulse" />
              <span className="font-bold">{totalUsers.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground uppercase">Aktif</span>
            </div>
          </div>
        </div>
      </header>

      {/* Grid */}
      <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-24 md:pb-8">
        {ROOMS.map(room => {
          // Calculate percentages
          const totalVotes = room.poll.votesA + room.poll.votesB;
          const pctA = Math.round((room.poll.votesA / totalVotes) * 100);
          const pctB = 100 - pctA;

          // Resolve Icon dynamically
          const Icon = (Icons as any)[room.icon] || Icons.CircleDashed;

          return (
            <Link key={room.id} href={`/room/${room.id}`}>
              <div
                data-testid={`room-card-${room.id}`}
                className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all cursor-pointer flex flex-col h-full"
              >
                {/* Header/Banner */}
                <div 
                  className="h-24 p-4 flex items-end relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${room.gradient[0]}20, ${room.gradient[1]}10)` }}
                >
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/80 backdrop-blur px-2 py-1 rounded-full border border-border">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Canlı</span>
                  </div>
                  <Icon className="w-24 h-24 absolute -right-4 -bottom-4 opacity-10 rotate-12 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500" />
                  <div className="flex items-center gap-3 relative z-10">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${room.gradient[0]}, ${room.gradient[1]})` }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold">{room.name}</h2>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-medium text-foreground mb-4 line-clamp-2 min-h-[3rem]">
                    {room.poll.question}
                  </h3>
                  
                  {/* Poll Preview */}
                  <div className="mt-auto space-y-3">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-primary truncate max-w-[45%]">{room.poll.optionA}</span>
                      <span className="text-secondary truncate max-w-[45%] text-right">{room.poll.optionB}</span>
                    </div>
                    <div className="h-2 w-full bg-secondary/20 rounded-full overflow-hidden flex">
                      <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${pctA}%` }} />
                      <div className="h-full bg-secondary transition-all duration-1000" style={{ width: `${pctB}%` }} />
                    </div>
                    <div className="flex justify-between text-xs font-bold text-muted-foreground">
                      <span>%{pctA}</span>
                      <span>%{pctB}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">{room.activeUsers} kişi</span>
                    </div>
                    <div className="font-bold text-primary group-hover:translate-x-1 transition-transform">
                      Giriş Yap &rarr;
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
