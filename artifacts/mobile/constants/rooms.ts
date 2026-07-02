export interface Poll {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  votesA: number;
  votesB: number;
  endsAt: number;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  icon: string;
  gradient: [string, string];
  activeUsers: number;
  poll: Poll;
}

export const ROOMS: Room[] = [
  {
    id: 'gundem',
    name: 'Gündem',
    description: 'Siyaset & Güncel Meseleler',
    icon: 'newspaper-outline',
    gradient: ['#1a1a2e', '#16213e'],
    activeUsers: 12432,
    poll: {
      id: 'g1',
      question: "Türkiye'nin ekonomisi düzeliyor mu?",
      optionA: 'Evet, düzeliyor',
      optionB: 'Hayır, kötüleşiyor',
      votesA: 38400,
      votesB: 51600,
      endsAt: Date.now() + 86400000,
    },
  },
  {
    id: 'futbol',
    name: 'Futbol',
    description: 'GS, FB, BJK & Transfer',
    icon: 'football-outline',
    gradient: ['#1a2e1a', '#163a16'],
    activeUsers: 18934,
    poll: {
      id: 'f1',
      question: 'Bu sezon şampiyon kim olur?',
      optionA: 'Galatasaray',
      optionB: 'Fenerbahçe',
      votesA: 62300,
      votesB: 37700,
      endsAt: Date.now() + 86400000,
    },
  },
  {
    id: 'magazin',
    name: 'Magazin',
    description: 'Ünlüler, Dizi & Olaylar',
    icon: 'star-outline',
    gradient: ['#2e1a2e', '#3e1638'],
    activeUsers: 8721,
    poll: {
      id: 'm1',
      question: 'Yılın en iyi dizisi hangisi?',
      optionA: 'Yabancı Dizi',
      optionB: 'Yerli Dizi',
      votesA: 45200,
      votesB: 54800,
      endsAt: Date.now() + 86400000,
    },
  },
  {
    id: 'teknoloji',
    name: 'Teknoloji',
    description: 'iPhone vs Android, AI',
    icon: 'hardware-chip-outline',
    gradient: ['#0a1628', '#0d2040'],
    activeUsers: 11204,
    poll: {
      id: 't1',
      question: 'Hangisi daha iyi?',
      optionA: 'iPhone',
      optionB: 'Android',
      votesA: 52100,
      votesB: 47900,
      endsAt: Date.now() + 86400000,
    },
  },
  {
    id: 'yemek',
    name: 'Yemek',
    description: 'Menemen Kavgası Burada',
    icon: 'restaurant-outline',
    gradient: ['#2e1a0a', '#3e2010'],
    activeUsers: 6843,
    poll: {
      id: 'y1',
      question: 'Menemen nasıl yapılır?',
      optionA: 'Soğanlı',
      optionB: 'Soğansız',
      votesA: 48700,
      votesB: 51300,
      endsAt: Date.now() + 86400000,
    },
  },
  {
    id: 'iliskiler',
    name: 'İlişkiler',
    description: 'Kız/Erkek Muhabbeti',
    icon: 'heart-outline',
    gradient: ['#2e0a1a', '#3e1028'],
    activeUsers: 9512,
    poll: {
      id: 'i1',
      question: 'Aşkta kim önce barışmalı?',
      optionA: 'Hata yapan',
      optionB: 'Erkek her zaman',
      votesA: 71200,
      votesB: 28800,
      endsAt: Date.now() + 86400000,
    },
  },
  {
    id: 'oyun',
    name: 'Oyun',
    description: 'LOL, Valorant, CS2',
    icon: 'game-controller-outline',
    gradient: ['#0a0a2e', '#10104a'],
    activeUsers: 14320,
    poll: {
      id: 'o1',
      question: 'En iyi FPS hangisi?',
      optionA: 'Valorant',
      optionB: 'CS2',
      votesA: 58900,
      votesB: 41100,
      endsAt: Date.now() + 86400000,
    },
  },
  {
    id: 'araba',
    name: 'Araba',
    description: 'BMW vs Mercedes, TOGG',
    icon: 'car-outline',
    gradient: ['#1a1a1a', '#252535'],
    activeUsers: 7234,
    poll: {
      id: 'a1',
      question: 'Hangi marka daha prestijli?',
      optionA: 'BMW',
      optionB: 'Mercedes',
      votesA: 53400,
      votesB: 46600,
      endsAt: Date.now() + 86400000,
    },
  },
  {
    id: 'finans',
    name: 'Finans',
    description: 'Borsa, Kripto, Altın',
    icon: 'trending-up-outline',
    gradient: ['#0a2e1a', '#0d3d20'],
    activeUsers: 10891,
    poll: {
      id: 'fin1',
      question: 'En iyi yatırım aracı?',
      optionA: 'Kripto',
      optionB: 'Altın',
      votesA: 44100,
      votesB: 55900,
      endsAt: Date.now() + 86400000,
    },
  },
  {
    id: 'serbest',
    name: 'Serbest Kürsü',
    description: 'Her Türlü Konu',
    icon: 'mic-outline',
    gradient: ['#2e2a0a', '#3e380d'],
    activeUsers: 5432,
    poll: {
      id: 's1',
      question: "Türkiye'de yaşam kalitesi nasıl?",
      optionA: 'İyi gidiyor',
      optionB: 'Kötü gidiyor',
      votesA: 32100,
      votesB: 67900,
      endsAt: Date.now() + 86400000,
    },
  },
];
