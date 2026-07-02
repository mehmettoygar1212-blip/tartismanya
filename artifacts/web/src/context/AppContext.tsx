import React, { createContext, useContext, useState, useEffect } from 'react';
import { ROOMS } from '@/lib/rooms';
import { useAuth } from './AuthContext';

export type ChatMessage = {
  id: string;
  userId: string;
  userName: string;
  team: 'A' | 'B' | null;
  text: string;
  timestamp: number;
};

type AppContextType = {
  votes: Record<string, 'A' | 'B'>;
  messages: Record<string, ChatMessage[]>;
  getVote: (roomId: string) => 'A' | 'B' | null;
  castVote: (roomId: string, team: 'A' | 'B') => void;
  getMessages: (roomId: string, tab: 'A' | 'B' | 'Global') => ChatMessage[];
  sendMessage: (roomId: string, tab: 'A' | 'B' | 'Global', text: string) => void;
};

const AppContext = createContext<AppContextType | null>(null);

const MOCK_MESSAGES_TEMPLATES = [
  "Kesinlikle katılıyorum!",
  "Saçmalama, bu çok yanlış bir düşünce.",
  "Bence ikisi de değil, ama bu taraf daha mantıklı.",
  "Tarih bizi haklı çıkaracak.",
  "İstatistiklere bakarsan gerçekleri görürsün.",
  "Duygusal yaklaşıyorsunuz.",
  "Bizim taraf her zaman kazanır!",
  "Sadece gerçekleri konuşalım lütfen.",
  "O kadar da abartılacak bir şey yok.",
  "Bunu tartışmamız bile komik.",
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [votes, setVotes] = useState<Record<string, 'A' | 'B'>>({});
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});

  // Init mock data
  useEffect(() => {
    const storedVotes = localStorage.getItem('tartismanya_votes');
    if (storedVotes) {
      try {
        setVotes(JSON.parse(storedVotes));
      } catch (e) {}
    }

    const initialMessages: Record<string, ChatMessage[]> = {};
    ROOMS.forEach(room => {
      ['A', 'B', 'Global'].forEach(tab => {
        const key = `${room.id}_${tab}`;
        initialMessages[key] = Array.from({ length: 15 }).map((_, i) => ({
          id: `${key}_${i}`,
          userId: `u_${i}`,
          userName: `User${Math.floor(Math.random() * 9000) + 1000}`,
          team: tab === 'Global' ? (Math.random() > 0.5 ? 'A' : 'B') : (tab as 'A' | 'B'),
          text: MOCK_MESSAGES_TEMPLATES[Math.floor(Math.random() * MOCK_MESSAGES_TEMPLATES.length)],
          timestamp: Date.now() - (15 - i) * 60000,
        }));
      });
    });
    setMessages(initialMessages);
  }, []);

  const getVote = (roomId: string) => votes[roomId] || null;

  const castVote = (roomId: string, team: 'A' | 'B') => {
    const newVotes = { ...votes, [roomId]: team };
    setVotes(newVotes);
    localStorage.setItem('tartismanya_votes', JSON.stringify(newVotes));
  };

  const getMessages = (roomId: string, tab: 'A' | 'B' | 'Global') => {
    return messages[`${roomId}_${tab}`] || [];
  };

  const sendMessage = (roomId: string, tab: 'A' | 'B' | 'Global', text: string) => {
    if (!user) return;
    
    const key = `${roomId}_${tab}`;
    const userVote = getVote(roomId);
    
    const newMsg: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.uid,
      userName: user.displayName,
      team: userVote,
      text,
      timestamp: Date.now(),
    };

    setMessages(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), newMsg],
    }));
  };

  return (
    <AppContext.Provider value={{ votes, messages, getVote, castVote, getMessages, sendMessage }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
