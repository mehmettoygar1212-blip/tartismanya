---
name: Tartışmanya app (mobile + web)
description: Architecture decisions, demo-mode rules, and known quirks for the Expo + React/Vite debate platform.
---

## Admin access (both platforms)
Only `admin@tartismanya.com` (exact match, lowercase) triggers admin mode in demo.
`isAdmin` is always **derived from email at runtime** — never trusted from localStorage or stored state.

**Why:** Substring match was a privilege-escalation path. Storing `isAdmin: true` in localStorage/AsyncStorage allows tampering. Derivation at load-time removes the attack surface.

**How to apply:** Never persist isAdmin. Never substring-match email for admin. In Firebase mode, admin should come from custom claims or a Firestore user document (not implemented yet — frontend derives from email as a stand-in).

## Firebase auth subscription cleanup (both platforms)
`initAuth()` is async, so the `useEffect` cleanup cannot use `return asyncFn()`. Use `useRef` to store the unsubscribe from `onAuthStateChanged`, and call it in the effect's return function.

## Dual-mode auth (web — AuthContext)
`IS_FIREBASE_CONFIGURED` (from `lib/firebase.ts`) gates the auth path:
- **Firebase mode:** Uses `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `GoogleAuthProvider` + `signInWithPopup`. `onAuthStateChanged` subscriber drives state.
- **Demo mode:** Accepts any credentials, stores profile in `localStorage`. `isAdmin` re-derived from email on every load (not from stored value).

## Vote immutability
`castVote` in AppContext returns early if `votes[roomId]` already exists — votes cannot be changed after casting. UI gates are a secondary enforcement only.

## AppContext message seeding
`getMessages()` must be a pure read — seed all messages upfront in `useState` lazy initializer. Never call setState during render.

## FlatList + inverted (mobile)
With `inverted` on FlatList, pass messages in chronological order (oldest first). Do NOT reverse — inverted already flips display.

## Firebase auth import (mobile)
`getReactNativePersistence` may not be available in all Firebase SDK builds. Wrap in try/catch and fall back to `getAuth(app)`.

## Dark-only theme
Both platforms are permanently dark. Force `class="dark"` on `<html>` (web) and always return dark tokens from `useColors()` (mobile). Never add a light mode toggle.

## Font
Both platforms use Plus Jakarta Sans. Web: `@import url(...)` must be the very first line of `index.css`. Mobile: loaded via `useFonts` in `app/_layout.tsx`.
