import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import type { Room } from '@/constants/rooms';

interface Props {
  room: Room;
  onPress: () => void;
  isFeatured?: boolean;
}

export function RoomCard({ room, onPress, isFeatured }: Props) {
  const colors = useColors();
  const totalVotes = room.poll.votesA + room.poll.votesB;
  const percentA = totalVotes > 0 ? Math.round((room.poll.votesA / totalVotes) * 100) : 50;
  const percentB = 100 - percentA;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.82 : 1 }]}
    >
      <LinearGradient
        colors={room.gradient}
        style={[
          styles.gradient,
          {
            borderRadius: colors.radius,
            borderColor: colors.glassBorder,
            borderWidth: 1,
          },
        ]}
      >
        {isFeatured && (
          <View style={[styles.featuredBadge, { backgroundColor: colors.teamA }]}>
            <Text style={styles.featuredText}>GÜNÜN KAVGASI</Text>
          </View>
        )}

        <View style={styles.header}>
          <View style={[styles.iconBox, { backgroundColor: colors.glass }]}>
            <Ionicons name={room.icon as any} size={20} color="#FFFFFF" />
          </View>
          <View style={[styles.activePill, { backgroundColor: colors.glass }]}>
            <View style={[styles.dot, { backgroundColor: colors.success }]} />
            <Text style={[styles.activeText, { color: colors.mutedForeground }]}>
              {room.activeUsers >= 1000
                ? `${(room.activeUsers / 1000).toFixed(1)}k`
                : room.activeUsers}
            </Text>
          </View>
        </View>

        <Text style={styles.roomName}>{room.name}</Text>
        <Text style={[styles.question, { color: 'rgba(255,255,255,0.6)' }]} numberOfLines={2}>
          {room.poll.question}
        </Text>

        {/* Vote bar */}
        <View style={styles.barTrack}>
          <View style={[styles.barSegA, { flex: percentA, backgroundColor: colors.teamA }]} />
          <View style={[styles.barSegB, { flex: percentB, backgroundColor: colors.teamB }]} />
        </View>

        <View style={styles.options}>
          <Text style={[styles.optionA, { color: colors.teamA }]}>
            {room.poll.optionA} {percentA}%
          </Text>
          <Text style={[styles.optionB, { color: colors.teamB }]}>
            {percentB}% {room.poll.optionB}
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1 },
  gradient: { padding: 14, gap: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 20,
  },
  dot: { width: 5, height: 5, borderRadius: 2.5 },
  activeText: { fontSize: 10, fontFamily: 'PlusJakartaSans_500Medium' },
  roomName: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },
  question: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    lineHeight: 16,
  },
  barTrack: { height: 4, borderRadius: 2, flexDirection: 'row', overflow: 'hidden', marginTop: 2 },
  barSegA: { height: 4 },
  barSegB: { height: 4 },
  options: { flexDirection: 'row', justifyContent: 'space-between' },
  optionA: { fontSize: 9, fontFamily: 'PlusJakartaSans_700Bold' },
  optionB: { fontSize: 9, fontFamily: 'PlusJakartaSans_700Bold' },
  featuredBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    marginBottom: 2,
  },
  featuredText: {
    fontSize: 8,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
});
