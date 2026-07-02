---
name: Tartışmanya mobile app
description: Architecture decisions, demo-mode rules, and known quirks for the Expo debate app.
---

## Demo admin access
Only `admin@tartismanya.com` (exact match, lowercase) triggers admin mode in demo. Substring matching was deliberately removed to prevent privilege escalation.

**Why:** Code review flagged substring `email.includes('admin')` as a direct privilege-escalation path. Fixed to exact-match constant.

**How to apply:** Never revert to substring-based admin checks. In Firebase mode, admin flag comes from Firestore user document only.

## Firebase auth subscription cleanup
`initAuth()` is async, so the `useEffect` cleanup cannot use `return asyncFn()` — the returned Promise is not a cleanup function.

**Why:** The unsubscribe from `onAuthStateChanged` was being silently dropped, causing a memory/subscription leak.

**How to apply:** Use `useRef` to store the unsubscribe, set it inside the async init, and clean it up in the effect's return function. See `context/AuthContext.tsx`.

## AppContext message seeding
`getMessages()` must be a pure read — never call `setState` during render. Seed all rooms' messages upfront via `useState(buildInitialMessages)` (lazy initializer).

**Why:** Calling `setMessages` inside `getMessages` (which is called during render) caused React anti-pattern warnings and potential infinite loops.

**How to apply:** Keep `buildInitialMessages` as the lazy initializer; `getMessages` only reads from state.

## FlatList + inverted
With `inverted` on FlatList, pass messages in chronological order (oldest first). Do NOT reverse the array before passing — inverted already flips display.

**Why:** `[...messages].reverse()` + `inverted` was double-reversing, and recreating an array on every render.

## Firebase auth import
`getReactNativePersistence` may not be available in all Firebase SDK builds. Always wrap `initializeAuth` with `getReactNativePersistence` in a try/catch and fall back to `getAuth(app)`.

## Dark-only theme
Both `colors.light` and `colors.dark` in `constants/colors.ts` hold the same dark brand palette. `useColors()` always returns dark tokens regardless of system scheme. Do NOT add a separate light palette unless explicitly requested.

## Plus Jakarta Sans font
Font family names: `PlusJakartaSans_400Regular`, `PlusJakartaSans_500Medium`, `PlusJakartaSans_600SemiBold`, `PlusJakartaSans_700Bold`. Loaded in `app/_layout.tsx` via `useFonts`.
