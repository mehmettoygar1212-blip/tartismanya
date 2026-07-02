import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

interface Props {
  displayName: string;
  size?: number;
  team?: 'A' | 'B' | null;
}

export function UserAvatar({ displayName, size = 36, team }: Props) {
  const colors = useColors();
  const initials = displayName.slice(0, 2).toUpperCase();
  const bgColor =
    team === 'A' ? colors.teamA : team === 'B' ? colors.teamB : colors.muted;

  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bgColor },
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.36, color: '#FFFFFF' }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { alignItems: 'center', justifyContent: 'center' },
  text: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
});
