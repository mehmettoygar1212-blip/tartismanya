/**
 * Tartışmanya brand design tokens — dark-only theme.
 * Both light and dark keys use the same dark palette so the app
 * always renders in dark mode regardless of system setting.
 */

const brandTokens = {
  // Legacy
  text: '#FFFFFF',
  tint: '#FF6B35',

  // Core surfaces
  background: '#0A0A0F',
  foreground: '#FFFFFF',

  // Cards / elevated surfaces
  card: '#15151F',
  cardForeground: '#FFFFFF',

  // Primary action — Team A (Orange)
  primary: '#FF6B35',
  primaryForeground: '#FFFFFF',

  // Secondary — Team B (Blue)
  secondary: '#4A90E2',
  secondaryForeground: '#FFFFFF',

  // Muted / subdued
  muted: '#1A1A2A',
  mutedForeground: 'rgba(255, 255, 255, 0.5)',

  // Borders & Inputs
  border: 'rgba(255, 255, 255, 0.08)',
  input: 'rgba(255, 255, 255, 0.10)',

  // Accent highlights
  accent: '#FF6B35',
  accentForeground: '#FFFFFF',

  // Destructive
  destructive: '#EF4444',
  destructiveForeground: '#FFFFFF',

  // Brand-specific tokens
  teamA: '#FF6B35',
  teamALight: 'rgba(255, 107, 53, 0.15)',
  teamB: '#4A90E2',
  teamBLight: 'rgba(74, 144, 226, 0.15)',

  // Surfaces
  glass: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(255, 255, 255, 0.10)',
  surface2: '#1E1E30',
  surfaceDark: '#0F0F1A',

  // Ranks
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',

  // Status
  success: '#22C55E',
};

const colors = {
  light: brandTokens,  // App is dark-only; both keys hold the dark palette
  dark: brandTokens,
  radius: 16,
};

export default colors;
