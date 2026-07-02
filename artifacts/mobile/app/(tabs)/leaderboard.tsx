import React from 'react';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { UserAvatar } from '@/components/UserAvatar';

interface Leader {
  uid: string;
  displayName: string;
  totalVotes: number;
  totalMessages: number;
  badges: string[];
  score: number;
}

const LEADERS: Leader[] = [
  { uid: '1', displayName: 'GalatasaraylıMert', totalVotes: 1847, totalMessages: 934, badges: ['futbol_lideri'], score: 9823 },
  { uid: '2', displayName: 'AyşeHanım42', totalVotes: 1621, totalMessages: 742, badges: ['gundem_uzman'], score: 8411 },
  { uid: '3', displayName: 'KaraKuş_TR', totalVotes: 1432, totalMessages: 654, badges: ['teknoloji_guru'], score: 7234 },
  { uid: '4', displayName: 'Bozkurt99', totalVotes: 1298, totalMessages: 521, badges: [], score: 6542 },
  { uid: '5', displayName: 'CemAlp_', totalVotes: 1187, totalMessages: 483, badges: [], score: 5921 },
  { uid: '6', displayName: 'İstanbulFan', totalVotes: 1043, totalMessages: 421, badges: [], score: 5234 },
  { uid: '7', displayName: 'YıldızKız', totalVotes: 982, totalMessages: 378, badges: [], score: 4892 },
  { uid: '8', displayName: 'TrabzonluHasan', totalVotes: 876, totalMessages: 312, badges: [], score: 4321 },
  { uid: '9', displayName: 'AnkaraLıAhmet', totalVotes: 754, totalMessages: 287, badges: [], score: 3847 },
  { uid: '10', displayName: 'SinopFan', totalVotes: 643, totalMessages: 231, badges: [], score: 3241 },
];

const BADGE_META: Record<string, { label: string; color: string }> = {
  futbol_lideri: { label: 'Futbol Lideri', color: '#22C55E' },
  gundem_uzman: { label: 'Gündem Uzmanı', color: '#4A90E2' },
  teknoloji_guru: { label: 'Teknoloji Guru', color: '#A855F7' },
  '10_oda_fatih': { label: '10 Oda Fatihi', color: '#FFD700' },
};

function RankMedal({ rank }: { rank: number }) {
  const colors = useColors();
  if (rank === 1) return <Ionicons name="trophy" size={22} color={colors.gold} />;
  if (rank === 2) return <Ionicons name="trophy" size={22} color={colors.silver} />;
  if (rank === 3) return <Ionicons name="trophy" size={22} color={colors.bronze} />;
  return (
    <Text style={[styles.rankNum, { color: colors.mutedForeground }]}>#{rank}</Text>
  );
}

function LeaderRow({ item, index }: { item: Leader; index: number }) {
  const colors = useColors();
  const rank = index + 1;
  const team: 'A' | 'B' = index % 2 === 0 ? 'A' : 'B';

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: rank <= 3 ? colors.card : colors.surfaceDark,
          borderColor: rank === 1 ? colors.gold + '44' : colors.glassBorder,
          borderRadius: colors.radius,
        },
      ]}
    >
      <View style={styles.rankCell}>
        <RankMedal rank={rank} />
      </View>
      <UserAvatar displayName={item.displayName} size={44} team={team} />
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
          {item.displayName}
        </Text>
        {item.badges.length > 0 && (
          <View style={styles.badgeRow}>
            {item.badges.slice(0, 1).map((b) => {
              const meta = BADGE_META[b];
              return meta ? (
                <View
                  key={b}
                  style={[styles.badge, { backgroundColor: meta.color + '22' }]}
                >
                  <Text style={[styles.badgeText, { color: meta.color }]}>{meta.label}</Text>
                </View>
              ) : null;
            })}
          </View>
        )}
        <Text style={[styles.meta, { color: colors.mutedForeground }]}>
          {item.totalVotes} oy · {item.totalMessages} mesaj
        </Text>
      </View>
      <Text style={[styles.score, { color: rank === 1 ? colors.gold : rank === 2 ? colors.silver : rank === 3 ? colors.bronze : colors.teamA }]}>
        {item.score.toLocaleString('tr-TR')}
      </Text>
    </View>
  );
}

export default function LeaderboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topInset + 12 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Sıralama</Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>Bu haftanın liderleri</Text>
      </View>

      <FlatList
        data={LEADERS}
        keyExtractor={(item) => item.uid}
        renderItem={({ item, index }) => <LeaderRow item={item} index={index} />}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 96 },
        ]}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 20 },
  title: { fontSize: 28, fontFamily: 'PlusJakartaSans_700Bold' },
  sub: { fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', marginTop: 2 },
  list: { paddingHorizontal: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
    borderWidth: 1,
  },
  rankCell: { width: 32, alignItems: 'center' },
  rankNum: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold' },
  info: { flex: 1, gap: 3 },
  name: { fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold' },
  badgeRow: { flexDirection: 'row', gap: 4 },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 9, fontFamily: 'PlusJakartaSans_600SemiBold' },
  meta: { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular' },
  score: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold' },
});
