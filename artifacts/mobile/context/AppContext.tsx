import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { storage } from '@/lib/storage';
import { ROOMS, Room } from '@/constants/rooms';

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  content: string;
  team: 'A' | 'B' | 'global';
  roomId: string;
  timestamp: number;
}

interface AppContextType {
  rooms: Room[];
  getVote: (roomId: string) => 'A' | 'B' | null;
  castVote: (roomId: string, team: 'A' | 'B') => Promise<void>;
  getMessages: (roomId: string, team: 'A' | 'B' | 'global') => ChatMessage[];
  sendMessage: (
    roomId: string,
    team: 'A' | 'B' | 'global',
    content: string,
    userId: string,
    username: string,
  ) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

const USERNAMES = [
  'GalatasaraylıMert', 'AyşeHanım42', 'KaraKuş_TR', 'Bozkurt99', 'CemAlp_',
  'YıldızKız', 'DelikanlıTR', 'StreetKingTR', 'AnkaraLıAhmet', 'TrabzonluHasan',
];

function seedMessages(roomId: string): ChatMessage[] {
  const room = ROOMS.find((r) => r.id === roomId);
  if (!room) return [];
  const now = Date.now();

  const aLines = [
    `${room.poll.optionA} kesinlikle daha iyi!`,
    'Ben her zaman bu tarafı destekliyorum',
    'İstatistiklere bakın, kazanan belli',
    'Arkadaşlar haklıyız biz!',
    `${room.poll.optionA} tarih boyunca hep kazandı`,
  ];
  const bLines = [
    `${room.poll.optionB} çok daha üstün`,
    'Gerçeği görmek zor oluyor bazen',
    'Tarih bize hak verecek',
    'Hepiniz yanılıyorsunuz',
    `${room.poll.optionB} daha mantıklı seçim`,
  ];
  const gLines = [
    'İlginç tartışma bu',
    'Her iki tarafın da argümanları var',
    'Bence cevap ortada',
    'Saat kaça kadar devam ediyor bu anket?',
    'Bugün çok aktif oda',
  ];

  const messages: ChatMessage[] = [];
  for (let i = 0; i < 10; i++) {
    const teamIdx = i % 3;
    const team: 'A' | 'B' | 'global' = teamIdx === 0 ? 'global' : teamIdx === 1 ? 'A' : 'B';
    const lines = team === 'A' ? aLines : team === 'B' ? bLines : gLines;
    messages.push({
      id: `seed_${roomId}_${i}`,
      userId: `seed_user_${i}`,
      username: USERNAMES[i % USERNAMES.length]!,
      content: lines[i % lines.length]!,
      team,
      roomId,
      timestamp: now - (10 - i) * 90000,
    });
  }
  return messages;
}

/** Build the initial messages map for all rooms and all tabs in one pass. */
function buildInitialMessages(): Record<string, ChatMessage[]> {
  const map: Record<string, ChatMessage[]> = {};
  for (const room of ROOMS) {
    const seeded = seedMessages(room.id);
    for (const tab of ['A', 'B', 'global'] as const) {
      map[`${room.id}_${tab}`] = seeded.filter((m) => m.team === tab);
    }
  }
  return map;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [votes, setVotes] = useState<Record<string, 'A' | 'B'>>({});
  // Pre-seeded on mount — never mutated during render
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(buildInitialMessages);

  useEffect(() => {
    storage.get<Record<string, 'A' | 'B'>>('votes').then((saved) => {
      if (saved) setVotes(saved);
    });
  }, []);

  function getVote(roomId: string): 'A' | 'B' | null {
    return votes[roomId] ?? null;
  }

  async function castVote(roomId: string, team: 'A' | 'B') {
    const updated = { ...votes, [roomId]: team };
    setVotes(updated);
    await storage.set('votes', updated);
  }

  /** Pure read — never triggers a state update. */
  function getMessages(roomId: string, team: 'A' | 'B' | 'global'): ChatMessage[] {
    return messages[`${roomId}_${team}`] ?? [];
  }

  const sendMessage = useCallback(
    async (
      roomId: string,
      team: 'A' | 'B' | 'global',
      content: string,
      userId: string,
      username: string,
    ) => {
      const msg: ChatMessage = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
        userId,
        username,
        content,
        team,
        roomId,
        timestamp: Date.now(),
      };
      const key = `${roomId}_${team}`;
      setMessages((prev) => ({
        ...prev,
        [key]: [...(prev[key] ?? []), msg],
      }));
    },
    [],
  );

  return (
    <AppContext.Provider value={{ rooms: ROOMS, getVote, castVote, getMessages, sendMessage }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
