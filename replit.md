# Tartışmanya

A Turkish multi-room social debate mobile app built with Expo (React Native).

## Stack

- **Frontend**: Expo SDK 52, React Native, Expo Router (file-based routing)
- **Auth**: Firebase Auth (Google + email/password) — falls back to demo mode if env vars are missing
- **Database**: Firebase Firestore — falls back to AsyncStorage in demo mode
- **Fonts**: Plus Jakarta Sans (`@expo-google-fonts/plus-jakarta-sans`)
- **Storage**: AsyncStorage for local persistence
- **Styling**: Custom dark theme only (`constants/colors.ts`)

## Architecture

```
artifacts/mobile/
├── app/
│   ├── _layout.tsx          # Root layout, font loading, AuthGate
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   └── login.tsx        # Login / register with Google option
│   ├── (tabs)/
│   │   ├── _layout.tsx      # Custom floating BlurView tab bar
│   │   ├── index.tsx        # Room grid (Odalar)
│   │   ├── leaderboard.tsx  # Top-10 leaderboard (Sıralama)
│   │   └── profile.tsx      # User profile + admin link
│   ├── room/
│   │   └── [id].tsx         # Room detail: poll + 3-tab chat
│   └── admin/
│       └── index.tsx        # Admin panel (stats, polls, users, complaints)
├── components/              # Reusable UI components
├── constants/
│   ├── colors.ts            # Brand palette (dark-only)
│   └── rooms.ts             # 10 debate room definitions with mock data
├── context/
│   ├── AuthContext.tsx      # Auth state, login/logout, demo mode
│   └── AppContext.tsx       # Rooms, votes, chat messages
└── lib/
    ├── firebase.ts          # Lazy Firebase init from env vars
    └── storage.ts           # AsyncStorage thin wrapper
```

## Running the App

The Expo dev server runs via the `artifacts/mobile: expo` workflow.

To preview on a physical device, scan the QR code shown in the workflow logs with the **Expo Go** app.

## Firebase Setup

The app runs in **demo mode** (mock data, AsyncStorage) until you provide Firebase credentials as environment secrets:

| Secret | Description |
|--------|-------------|
| `EXPO_PUBLIC_FIREBASE_API_KEY` | Firebase Web API Key |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | e.g. `your-project.firebaseapp.com` |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | e.g. `your-project.appspot.com` |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Numeric sender ID |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | Firebase App ID |

## Demo Mode

- Any email/password logs in (no real auth)
- Email containing "admin" gets admin panel access
- Votes and chat messages are stored in AsyncStorage

## Design

- **Theme**: Dark-only (`#0A0A0F` background)
- **Team A**: `#FF6B35` (orange)
- **Team B**: `#4A90E2` (blue)
- **Accent/Premium**: `#FFD700` (gold)
- **Font**: Plus Jakarta Sans

## User Preferences

- Dark-only theme — do not add light mode
- Turkish language for all UI text
- Plus Jakarta Sans font throughout
