import React from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';
import { UserAvatar } from '@/components/UserAvatar';

const BADGE_META: Record<string, { label: string; icon: string; color: string }> = {
  futbol_lideri: { label: 'Futbol Odası Lideri', icon: 'football', color: '#22C55E' },
  '10_oda_fatih': { label: '10 Oda Fatihi', icon: 'star', color: '#FFD700' },
  gundem_uzman: { label: 'Gündem Uzmanı', icon: 'newspaper', color: '#4A90E2' },
};

interface SettingRowProps {
  icon: string;
  label: string;
  color?: string;
  onPress?: () => void;
  right?: React.ReactNode;
}

function SettingRow({ icon, label, color, onPress, right }: SettingRowProps) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.settingRow, { borderBottomColor: colors.border }]}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon as any} size={20} color={color ?? colors.mutedForeground} />
        <Text style={[styles.settingLabel, { color: color ?? colors.foreground }]}>{label}</Text>
      </View>
      {right ?? <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuth();
  const topInset = Platform.OS === 'web' ? 67 : insets.top;

  if (!user) return null;

  function confirmLogout() {
    Alert.alert('Çıkış Yap', 'Hesabınızdan çıkmak istediğinizden emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Çıkış', style: 'destructive', onPress: logout },
    ]);
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile header */}
      <View style={[styles.profileHeader, { paddingTop: topInset + 20 }]}>
        <UserAvatar displayName={user.displayName} size={80} team="A" />
        <View style={styles.profileText}>
          <View style={styles.nameRow}>
            <Text style={[styles.displayName, { color: colors.foreground }]}>
              {user.displayName}
            </Text>
            {user.isPremium && (
              <View style={[styles.chip, { backgroundColor: colors.gold + '22' }]}>
                <Ionicons name="star" size={11} color={colors.gold} />
                <Text style={[styles.chipText, { color: colors.gold }]}>PLUS</Text>
              </View>
            )}
            {user.isAdmin && (
              <View style={[styles.chip, { backgroundColor: colors.teamA + '22' }]}>
                <Text style={[styles.chipText, { color: colors.teamA }]}>ADMİN</Text>
              </View>
            )}
          </View>
          <Text style={[styles.email, { color: colors.mutedForeground }]}>{user.email}</Text>
        </View>
      </View>

      {/* Stats */}
      <View
        style={[
          styles.statsCard,
          { backgroundColor: colors.card, borderColor: colors.glassBorder },
        ]}
      >
        <View style={styles.statCol}>
          <Text style={[styles.statVal, { color: colors.teamA }]}>{user.totalVotes}</Text>
          <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Oy</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statCol}>
          <Text style={[styles.statVal, { color: colors.teamB }]}>{user.totalMessages}</Text>
          <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Mesaj</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statCol}>
          <Text style={[styles.statVal, { color: colors.success }]}>{user.badges.length}</Text>
          <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Rozet</Text>
        </View>
      </View>

      {/* Badges */}
      {user.badges.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Rozetler</Text>
          <View style={styles.badgeGrid}>
            {user.badges.map((b) => {
              const meta = BADGE_META[b];
              return meta ? (
                <View
                  key={b}
                  style={[
                    styles.badgeCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: meta.color + '44',
                      borderRadius: 14,
                    },
                  ]}
                >
                  <Ionicons name={meta.icon as any} size={24} color={meta.color} />
                  <Text style={[styles.badgeLabel, { color: colors.foreground }]}>{meta.label}</Text>
                </View>
              ) : null;
            })}
          </View>
        </View>
      )}

      {/* Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Ayarlar</Text>
        <View
          style={[
            styles.settingsList,
            { backgroundColor: colors.card, borderColor: colors.glassBorder },
          ]}
        >
          {!user.isPremium && (
            <SettingRow
              icon="star"
              label="Tartışmanya Plus"
              color={colors.gold}
              right={
                <View style={[styles.priceTag, { backgroundColor: colors.gold }]}>
                  <Text style={styles.priceText}>49.99₺/ay</Text>
                </View>
              }
            />
          )}
          <SettingRow icon="notifications-outline" label="Bildirimler" />
          <SettingRow icon="shield-outline" label="Gizlilik" />
          <SettingRow icon="help-circle-outline" label="Yardım" />
          {user.isAdmin && (
            <SettingRow
              icon="settings"
              label="Admin Paneli"
              color={colors.teamA}
              onPress={() => router.push('/admin')}
            />
          )}
          <SettingRow
            icon="log-out-outline"
            label="Çıkış Yap"
            color={colors.destructive}
            onPress={confirmLogout}
            right={null}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileHeader: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileText: { flex: 1, gap: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  displayName: { fontSize: 22, fontFamily: 'PlusJakartaSans_700Bold' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  chipText: { fontSize: 10, fontFamily: 'PlusJakartaSans_700Bold', letterSpacing: 0.5 },
  email: { fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular' },
  statsCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 20,
  },
  statCol: { flex: 1, alignItems: 'center', gap: 4 },
  statVal: { fontSize: 26, fontFamily: 'PlusJakartaSans_700Bold' },
  statLbl: { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular' },
  statDivider: { width: 1, marginVertical: 4 },
  section: { paddingHorizontal: 16, marginBottom: 24, gap: 12 },
  sectionTitle: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold' },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  badgeCard: { padding: 14, gap: 8, alignItems: 'center', borderWidth: 1, minWidth: 100 },
  badgeLabel: { fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold', textAlign: 'center' },
  settingsList: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingLabel: { fontSize: 15, fontFamily: 'PlusJakartaSans_500Medium' },
  priceTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  priceText: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#000' },
});
