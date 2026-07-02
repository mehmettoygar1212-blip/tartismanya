import React, { useState, useEffect, useRef } from 'react';
import { useRoute, Link } from 'wouter';
import { ROOMS } from '@/lib/rooms';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import * as Icons from 'lucide-react';
import { ChevronLeft, Send, Users, ShieldAlert } from 'lucide-react';

export default function RoomPage() {
  const [, params] = useRoute('/room/:id');
  const roomId = params?.id;
  const room = ROOMS.find(r => r.id === roomId);
  const { user } = useAuth();
  const { getVote, castVote, getMessages, sendMessage } = useApp();
  
  const [activeTab, setActiveTab] = useState<'A' | 'B' | 'Global'>('Global');
  const [inputText, setInputText] = useState('');
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const userVote = roomId ? getVote(roomId) : null;
  const messages = roomId ? getMessages(roomId, activeTab) : [];

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeTab]);

  if (!room) return <div className="p-8 text-center">Oda bulunamadı.</div>;

  const totalVotes = room.poll.votesA + room.poll.votesB;
  
  // Real numbers plus user vote if casted
  const currentVotesA = room.poll.votesA + (userVote === 'A' ? 1 : 0);
  const currentVotesB = room.poll.votesB + (userVote === 'B' ? 1 : 0);
  const currentTotal = currentVotesA + currentVotesB;
  
  const pctA = Math.round((currentVotesA / currentTotal) * 100) || 0;
  const pctB = 100 - pctA;

  const Icon = (Icons as any)[room.icon] || Icons.CircleDashed;

  const handleVote = (team: 'A' | 'B') => {
    if (userVote) return; // already voted
    castVote(room.id, team);
    // Switch to team tab automatically
    setActiveTab(team);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !userVote) return;
    sendMessage(room.id, activeTab, inputText.trim());
    setInputText('');
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <header 
        className="flex-shrink-0 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${room.gradient[0]}30, ${room.gradient[1]}10)` }}
      >
        <div className="absolute inset-0 border-b border-border bg-background/50 backdrop-blur-sm" />
        <div className="relative z-10 px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/rooms">
              <button className="w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors">
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
            </Link>
            <div className="flex items-center gap-2">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
                style={{ background: `linear-gradient(135deg, ${room.gradient[0]}, ${room.gradient[1]})` }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight">{room.name}</h1>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                  <span>{room.activeUsers.toLocaleString()} aktif</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Arena Poll Section */}
      <div className="flex-shrink-0 p-4 border-b border-border bg-card">
        <h2 className="text-xl font-black mb-4 text-center">{room.poll.question}</h2>
        
        {!userVote ? (
          <div className="flex gap-2">
            <button
              data-testid="vote-btn-a"
              onClick={() => handleVote('A')}
              className="flex-1 py-4 px-2 rounded-xl bg-card border-2 border-primary/20 hover:border-primary hover:bg-primary/10 transition-all flex flex-col items-center gap-2"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-primary">A Takımı</span>
              <span className="font-bold text-lg text-center leading-tight">{room.poll.optionA}</span>
            </button>
            <div className="flex items-center justify-center px-2 text-muted-foreground font-black italic">VS</div>
            <button
              data-testid="vote-btn-b"
              onClick={() => handleVote('B')}
              className="flex-1 py-4 px-2 rounded-xl bg-card border-2 border-secondary/20 hover:border-secondary hover:bg-secondary/10 transition-all flex flex-col items-center gap-2"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-secondary">B Takımı</span>
              <span className="font-bold text-lg text-center leading-tight">{room.poll.optionB}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-bold">
              <span className={`truncate max-w-[45%] ${userVote === 'A' ? 'text-primary' : 'text-muted-foreground'}`}>
                {room.poll.optionA} {userVote === 'A' && '(Sen)'}
              </span>
              <span className={`truncate max-w-[45%] text-right ${userVote === 'B' ? 'text-secondary' : 'text-muted-foreground'}`}>
                {userVote === 'B' && '(Sen)'} {room.poll.optionB}
              </span>
            </div>
            <div className="h-4 w-full bg-card-border rounded-full overflow-hidden flex relative shadow-inner">
              <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${pctA}%` }} />
              <div className="h-full bg-secondary transition-all duration-1000" style={{ width: `${pctB}%` }} />
              
              {/* VS Marker */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-background" />
            </div>
            <div className="flex justify-between text-xs font-black">
              <span className="text-primary">{pctA}% ({currentVotesA.toLocaleString()})</span>
              <span className="text-secondary">{pctB}% ({currentVotesB.toLocaleString()})</span>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 flex border-b border-border bg-background">
        <button
          onClick={() => setActiveTab('A')}
          disabled={!userVote || userVote === 'B'}
          className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${
            activeTab === 'A' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
          } ${(!userVote || userVote === 'B') && 'opacity-30 cursor-not-allowed'}`}
        >
          A Takımı
        </button>
        <button
          onClick={() => setActiveTab('Global')}
          className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${
            activeTab === 'Global' ? 'border-white text-white' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Meydan
        </button>
        <button
          onClick={() => setActiveTab('B')}
          disabled={!userVote || userVote === 'A'}
          className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${
            activeTab === 'B' ? 'border-secondary text-secondary' : 'border-transparent text-muted-foreground hover:text-foreground'
          } ${(!userVote || userVote === 'A') && 'opacity-30 cursor-not-allowed'}`}
        >
          B Takımı
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {!userVote && activeTab !== 'Global' ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-8">
            <ShieldAlert className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-medium">Takım sohbetini görmek için önce tarafını seçmelisin.</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
            <p className="font-medium">Henüz mesaj yok. İlk mesajı sen gönder!</p>
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.userId === user?.uid;
            const isTeamA = msg.team === 'A';
            const isTeamB = msg.team === 'B';
            
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1">
                  {!isMe && (
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      isTeamA ? 'bg-primary/20 text-primary' : isTeamB ? 'bg-secondary/20 text-secondary' : 'bg-muted text-muted-foreground'
                    }`}>
                      {isTeamA ? 'A' : isTeamB ? 'B' : 'Tarafsız'}
                    </span>
                  )}
                  <span className="text-xs font-semibold text-muted-foreground">{msg.userName}</span>
                </div>
                
                <div className={`max-w-[85%] px-4 py-2 rounded-2xl ${
                  isMe 
                    ? (isTeamA ? 'bg-primary text-white rounded-tr-sm' : 'bg-secondary text-white rounded-tr-sm') 
                    : (isTeamA ? 'bg-primary/10 border border-primary/20 text-foreground rounded-tl-sm' : 'bg-secondary/10 border border-secondary/20 text-foreground rounded-tl-sm')
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 p-4 border-t border-border bg-card pb-safe">
        {!userVote ? (
          <div className="text-center py-2 px-4 bg-muted rounded-xl text-sm font-medium text-muted-foreground border border-border">
            Sohbete katılmak için yukarıdan tarafını seç.
          </div>
        ) : (
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={`${activeTab === 'Global' ? 'Meydana' : 'Takımına'} mesaj gönder...`}
              className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
            />
            <button 
              type="submit"
              disabled={!inputText.trim()}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                inputText.trim() 
                  ? (userVote === 'A' ? 'bg-primary text-white hover:bg-primary/90' : 'bg-secondary text-white hover:bg-secondary/90') 
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
