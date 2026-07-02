import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import type { Room } from '@/constants/rooms';

// Extracted into its own component to avoid calling useAnimatedStyle inside a loop
function AnimatedBar({
  percentage,
  color,
  teamLabel,
  optionLabel,
}: {
  percentage: number;
  color: string;
  teamLabel: string;
  optionLabel: string;
}) {
  const colors = useColors();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(percentage / 100, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });
  }, [percentage]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%` as any,
  }));

  return (
    <View style={styles.barRow}>
      <View style={styles.barMeta}>
        <Text style={[styles.teamLabel, { color }]}>{teamLabel}</Text>
        <Text style={[styles.optionLabel, { color: colors.mutedForeground }]}>{optionLabel}</Text>
      </View>
      <View style={[styles.barTrack, { backgroundColor: colors.surface2 }]}>
        <Animated.View style={[styles.barFill, { backgroundColor: color }, fillStyle]} />
      </View>
      <Text style={[styles.percentLabel, { color }]}>{percentage}%</Text>
    </View>
  );
}

interface Props {
  room: Room;
  vote: 'A' | 'B' | null;
  onVote: (team: 'A' | 'B') => void;
}

export function PollCard({ room, vote, onVote }: Props) {
  const colors = useColors();
  const total = room.poll.votesA + room.poll.votesB;
  const pA = total > 0 ? Math.round((room.poll.votesA / total) * 100) : 50;
  const pB = 100 - pA;

  const scaleA = useSharedValue(1);
  const scaleB = useSharedValue(1);
  const styleA = useAnimatedStyle(() => ({ transform: [{ scale: scaleA.value }] }));
  const styleB = useAnimatedStyle(() => ({ transform: [{ scale: scaleB.value }] }));

  function handleVote(team: 'A' | 'B') {
    if (vote) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const sv = team === 'A' ? scaleA : scaleB;
    sv.value = withSpring(0.93, { duration: 100 }, () => {
      sv.value = withSpring(1);
    });
    onVote(team);
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.glassBorder,
          borderRadius: colors.radius,
        },
      ]}
    >
      <Text style={[styles.question, { color: colors.foreground }]}>{room.poll.question}</Text>

      {!vote ? (
        <View style={styles.buttonRow}>
          <Animated.View style={[{ flex: 1 }, styleA]}>
            <Pressable
              onPress={() => handleVote('A')}
              style={[
                styles.voteBtn,
                {
                  backgroundColor: colors.teamALight,
                  borderColor: colors.teamA,
                  borderRadius: 14,
                },
              ]}
            >
              <Text style={[styles.voteLetter, { color: colors.teamA }]}>A</Text>
              <Text style={[styles.voteOption, { color: colors.teamA }]}>{room.poll.optionA}</Text>
            </Pressable>
          </Animated.View>

          <View style={[styles.vsCircle, { backgroundColor: colors.surface2 }]}>
            <Text style={[styles.vsText, { color: colors.mutedForeground }]}>VS</Text>
          </View>

          <Animated.View style={[{ flex: 1 }, styleB]}>
            <Pressable
              onPress={() => handleVote('B')}
              style={[
                styles.voteBtn,
                {
                  backgroundColor: colors.teamBLight,
                  borderColor: colors.teamB,
                  borderRadius: 14,
                },
              ]}
            >
              <Text style={[styles.voteLetter, { color: colors.teamB }]}>B</Text>
              <Text style={[styles.voteOption, { color: colors.teamB }]}>{room.poll.optionB}</Text>
            </Pressable>
          </Animated.View>
        </View>
      ) : (
        <View style={styles.results}>
          <Text style={[styles.votedNote, { color: colors.mutedForeground }]}>
            Oyunuz:{' '}
            <Text
              style={{
                color: vote === 'A' ? colors.teamA : colors.teamB,
                fontFamily: 'PlusJakartaSans_700Bold',
              }}
            >
              {vote === 'A' ? room.poll.optionA : room.poll.optionB}
            </Text>
          </Text>
          <AnimatedBar percentage={pA} color={colors.teamA} teamLabel="A" optionLabel={room.poll.optionA} />
          <AnimatedBar percentage={pB} color={colors.teamB} teamLabel="B" optionLabel={room.poll.optionB} />
          <Text style={[styles.totalVotes, { color: colors.mutedForeground }]}>
            Toplam {total.toLocaleString('tr-TR')} oy
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 20, marginHorizontal: 16, marginBottom: 0, borderWidth: 1 },
  question: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    lineHeight: 24,
    marginBottom: 18,
    textAlign: 'center',
  },
  buttonRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  voteBtn: { padding: 18, alignItems: 'center', gap: 8, borderWidth: 2 },
  voteLetter: { fontSize: 26, fontFamily: 'PlusJakartaSans_700Bold' },
  voteOption: { fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', textAlign: 'center' },
  vsCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsText: { fontSize: 10, fontFamily: 'PlusJakartaSans_700Bold', letterSpacing: 1 },
  results: { gap: 10 },
  votedNote: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    textAlign: 'center',
    marginBottom: 4,
  },
  barRow: { gap: 6 },
  barMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  teamLabel: { fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold' },
  optionLabel: { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular' },
  barTrack: { height: 10, borderRadius: 5, overflow: 'hidden' },
  barFill: { height: 10, borderRadius: 5 },
  percentLabel: { fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', alignSelf: 'flex-end' },
  totalVotes: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    textAlign: 'center',
    marginTop: 4,
  },
});
