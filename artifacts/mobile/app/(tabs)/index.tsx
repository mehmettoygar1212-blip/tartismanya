import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { RoomCard } from '@/components/RoomCard';
import type { Room } from '@/constants/rooms';

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { rooms } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  const totalActive = rooms.reduce((s, r) => s + r.activeUsers, 0);
  const topInset = Platform.OS === 'web' ? 67 : insets.top;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  function renderRoom({ item, index }: { item: Room; index: number }) {
    const isFeatured = item.id === 'futbol' && index === 0;
    return (
      <View style={styles.cardCell}>
        <RoomCard
          room={item}
          isFeatured={isFeatured}
          onPress={() => router.push(`/room/${item.id}`)}
        />
      </View>
    );
  }

  // Ensure futbol appears first
  const sorted = [...rooms].sort((a, b) => (a.id === 'futbol' ? -1 : b.id === 'futbol' ? 1 : 0));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topInset + 12 }]}>
        <View>
          <Text style={[styles.appTitle, { color: colors.foreground }]}>Tartışmanya</Text>
          <Text style={[styles.appSub, { color: colors.mutedForeground }]}>
            10 Oda · Tarafını Seç
          </Text>
        </View>
        <View style={styles.headerActions}>
          <View style={[styles.livePill, { backgroundColor: colors.teamALight }]}>
            <View style={[styles.liveDot, { backgroundColor: colors.teamA }]} />
            <Text style={[styles.liveText, { color: colors.teamA }]}>CANLI</Text>
          </View>
          <Pressable style={[styles.iconBtn, { backgroundColor: colors.glass }]}>
            <Ionicons name="notifications-outline" size={21} color={colors.foreground} />
          </Pressable>
        </View>
      </View>

      {/* Stats bar */}
      <View
        style={[
          styles.statsBar,
          { backgroundColor: colors.card, borderColor: colors.glassBorder },
        ]}
      >
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.teamA }]}>
            {(totalActive / 1000).toFixed(0)}k+
          </Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Aktif</Text>
        </View>
        <View style={[styles.statDiv, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.teamB }]}>10</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Oda</Text>
        </View>
        <View style={[styles.statDiv, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.success }]}>200k+</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Günlük Oy</Text>
        </View>
      </View>

      {/* Rooms grid */}
      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={renderRoom}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 96 }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        columnWrapperStyle={styles.colWrap}
        showsVerticalScrollIndicator={false}
        scrollEnabled={rooms.length > 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  appTitle: { fontSize: 28, fontFamily: 'PlusJakartaSans_700Bold', letterSpacing: -0.5 },
  appSub: { fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3 },
  liveText: { fontSize: 10, fontFamily: 'PlusJakartaSans_700Bold', letterSpacing: 1 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  statsBar: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { fontSize: 17, fontFamily: 'PlusJakartaSans_700Bold' },
  statLabel: { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular' },
  statDiv: { width: 1, marginVertical: 4 },
  list: { paddingHorizontal: 12, paddingTop: 4, gap: 10 },
  colWrap: { gap: 10, paddingHorizontal: 4 },
  cardCell: { flex: 1 },
});
