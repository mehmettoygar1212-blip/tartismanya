import { useColorScheme } from 'react-native';
import colors from '@/constants/colors';

/**
 * Returns the design tokens for the current color scheme.
 *
 * The app is dark-only — both `light` and `dark` keys hold the same
 * dark brand palette — so this hook always returns the dark tokens.
 * The scheme check is kept so toggling is trivial if light mode is added later.
 */
export function useColors() {
  const scheme = useColorScheme();
  const palette = scheme === 'dark' ? colors.dark : colors.light;
  return { ...palette, radius: colors.radius };
}
