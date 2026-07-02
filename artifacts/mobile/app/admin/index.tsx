import React, { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';
import { ROOMS } from '@/constants/rooms';

type Section = 'stats' | 'polls' | 'users' | 'reports' | 'filter';

const SECTIONS: { key: Section; icon: string; label: string }[] = [
  { key: 'stats', icon: 'bar-chart-outline', label: 'İstatistik' },
  { key: 'polls', icon: 'checkbox-outline', label: 'Anketler' },
  { key: 'users', icon: 'people-outline', label: 'Kullanıcılar' },
  { key: 'reports', icon: 'flag-outline', label: 'Şikayetler' },
  { key: 'filter', icon: 'shield-outline', label: 'Kelime Filtresi' },
];

const MOCK_REPORTS = [
  { id: 'r1', reporter: 'Kullanıcı1', reported: 'KaraKuş_TR', msg: 'amk ne diyorsun', reason: 'Küfür', room: 'Futbol', ago: '5dk' },
  { id: 'r2', reporter: 'AyşeHanım', reported: 'Bozkurt99', msg: 'Sana bir şey yapacağım', reason: 'Taciz', room: 'Gündem', ago: '12dk' },
  { id: 'r3', reporter: 'Mert42', reported: 'Spammer123', msg: 'bit.ly/kazan100tl', reason: 'Spam', room: 'Serbest', ago: '18dk' },
];

function StatCard({ icon, value, label, color }: { icon: string; value: string | number; label: string; color: string }) {
  const colors = useColors();
  return (
    <View style={[statStyles.card, { backgroundColor: colors.card, borderColor: colors.glassBorder }]}>
      <Ionicons name={icon as any} size={24} color={color} />
      <Text style={[statStyles.val, { color }]}>
        {typeof value === 'number' ? value.toLocaleString('tr-TR') : value}
      </Text>
      <Text style={[statStyles.label, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

export default function AdminScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const topInset = Platform.OS === 'web' ? 67 : insets.top;

  const [section, setSection] = useState<Section>('stats');
  const [userSearch, setUserSearch] = useState('');
  const [newWord, setNewWord] = useState('');
  const [blockedWords, setBlockedWords] = useState<string[]>(['amk', 'aq', 'siktir', 'mk']);

  if (!user?.isAdmin) {
    return (
      <View style={[styles.denied, { backgroundColor: colors.background }]}>
        <Ionicons name="lock-closed" size={52} color={colors.destructive} />
        <Text style={[styles.deniedTitle, { color: colors.foreground }]}>Yetkisiz Erişim</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.deniedBack, { color: colors.teamA }]}>Geri Dön</Text>
        </Pressable>
      </View>
    );
  }

  function addWord() {
    const w = newWord.trim().toLowerCase();
    if (!w || blockedWords.includes(w)) return;
    setBlockedWords((p) => [...p, w]);
    setNewWord('');
  }

  function removeWord(word: string) {
    setBlockedWords((p) => p.filter((w) => w !== word));
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topInset + 12, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>Admin Paneli</Text>
        <View style={[styles.adminChip, { backgroundColor: colors.teamA + '22' }]}>
          <Text style={[styles.adminChipText, { color: colors.teamA }]}>ADMİN</Text>
        </View>
      </View>

      {/* Section pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.pillScroll}
        contentContainerStyle={styles.pillRow}
      >
        {SECTIONS.map((s) => (
          <Pressable
            key={s.key}
            onPress={() => setSection(s.key)}
            style={[
              styles.pill,
              {
                backgroundColor: section === s.key ? colors.teamA : colors.card,
                borderColor: section === s.key ? colors.teamA : colors.glassBorder,
              },
            ]}
          >
            <Ionicons
              name={s.icon as any}
              size={15}
              color={section === s.key ? '#FFF' : colors.mutedForeground}
            />
            <Text
              style={[
                styles.pillText,
                { color: section === s.key ? '#FFF' : colors.mutedForeground },
              ]}
            >
              {s.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats */}
        {section === 'stats' && (
          <View style={styles.grid2}>
            <StatCard icon="people" value={105432} label="Aktif Kullanıcı" color={colors.success} />
            <StatCard icon="checkmark-circle" value={187230} label="Günlük Oy" color={colors.teamA} />
            <StatCard icon="chatbubble" value={43120} label="Günlük Mesaj" color={colors.teamB} />
            <StatCard icon="ban" value={23} label="Banlanan" color={colors.destructive} />
          </View>
        )}

        {/* Polls */}
        {section === 'polls' && (
          <View style={styles.list}>
            {ROOMS.map((room) => (
              <View
                key={room.id}
                style={[styles.pollRow, { backgroundColor: colors.card, borderColor: colors.glassBorder }]}
              >
                <Ionicons name={room.icon as any} size={18} color={colors.foreground} />
                <View style={styles.pollMeta}>
                  <Text style={[styles.pollRoom, { color: colors.foreground }]}>{room.name}</Text>
                  <Text style={[styles.pollQ, { color: colors.mutedForeground }]} numberOfLines={1}>
                    {room.poll.question}
                  </Text>
                </View>
                <Pressable
                  onPress={() => Alert.alert('Anket Düzenle', `${room.name} odası anketi düzenleniyor...`)}
                  style={[styles.editBtn, { backgroundColor: colors.glass }]}
                >
                  <Ionicons name="pencil-outline" size={16} color={colors.foreground} />
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {/* Users */}
        {section === 'users' && (
          <View style={styles.list}>
            <View
              style={[styles.searchRow, { backgroundColor: colors.card, borderColor: colors.glassBorder }]}
            >
              <Ionicons name="search-outline" size={18} color={colors.mutedForeground} />
              <TextInput
                placeholder="Kullanıcı adı veya e-posta..."
                placeholderTextColor={colors.mutedForeground}
                value={userSearch}
                onChangeText={setUserSearch}
                style={[styles.searchInput, { color: colors.foreground }]}
                autoCapitalize="none"
              />
            </View>
            <Text style={[styles.sectionHint, { color: colors.mutedForeground }]}>
              Kullanıcı arayın, ardından ceza seçin
            </Text>
            <View style={styles.banRow}>
              <Pressable
                onPress={() => Alert.alert('Susturuldu', `${userSearch || 'Kullanıcı'} 24 saat susturuldu`)}
                style={[styles.banBtn, { backgroundColor: colors.glass }]}
              >
                <Ionicons name="volume-mute-outline" size={16} color={colors.mutedForeground} />
                <Text style={[styles.banBtnText, { color: colors.mutedForeground }]}>24s Sustur</Text>
              </Pressable>
              <Pressable
                onPress={() => Alert.alert('Banlandı', `${userSearch || 'Kullanıcı'} 7 gün banlandı`)}
                style={[styles.banBtn, { backgroundColor: '#ff800020' }]}
              >
                <Ionicons name="timer-outline" size={16} color="#ff8000" />
                <Text style={[styles.banBtnText, { color: '#ff8000' }]}>7 Gün Ban</Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  Alert.alert('Kalıcı Ban', `${userSearch || 'Kullanıcı'} kalıcı olarak banlandı`)
                }
                style={[styles.banBtn, { backgroundColor: colors.destructive + '22' }]}
              >
                <Ionicons name="ban-outline" size={16} color={colors.destructive} />
                <Text style={[styles.banBtnText, { color: colors.destructive }]}>Kalıcı Ban</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Reports */}
        {section === 'reports' && (
          <View style={styles.list}>
            {MOCK_REPORTS.map((r) => (
              <View
                key={r.id}
                style={[styles.reportCard, { backgroundColor: colors.card, borderColor: colors.glassBorder }]}
              >
                <View style={styles.reportTop}>
                  <View style={[styles.reasonChip, { backgroundColor: colors.destructive + '22' }]}>
                    <Text style={[styles.reasonText, { color: colors.destructive }]}>{r.reason}</Text>
                  </View>
                  <Text style={[styles.reportAgo, { color: colors.mutedForeground }]}>{r.ago} önce · {r.room}</Text>
                </View>
                <Text style={[styles.reportMsg, { color: colors.foreground }]}>"{r.msg}"</Text>
                <Text style={[styles.reportMeta, { color: colors.mutedForeground }]}>
                  {r.reporter} şikayet etti → <Text style={{ color: colors.destructive }}>{r.reported}</Text>
                </Text>
                <View style={styles.reportActions}>
                  <Pressable
                    onPress={() => Alert.alert('Silindi', 'Mesaj silindi')}
                    style={[styles.actionBtn, { backgroundColor: colors.glass }]}
                  >
                    <Text style={[styles.actionText, { color: colors.mutedForeground }]}>Mesajı Sil</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => Alert.alert('Ban', `${r.reported} banlandı`)}
                    style={[styles.actionBtn, { backgroundColor: colors.destructive + '22' }]}
                  >
                    <Text style={[styles.actionText, { color: colors.destructive }]}>Banla</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Word Filter */}
        {section === 'filter' && (
          <View style={styles.list}>
            <Text style={[styles.filterHint, { color: colors.mutedForeground }]}>
              Bu kelimeler içeren mesajlar otomatik filtrelenir.
            </Text>
            <View
              style={[styles.searchRow, { backgroundColor: colors.card, borderColor: colors.glassBorder }]}
            >
              <TextInput
                placeholder="Yeni kelime ekle..."
                placeholderTextColor={colors.mutedForeground}
                value={newWord}
                onChangeText={setNewWord}
                style={[styles.searchInput, { color: colors.foreground }]}
                autoCapitalize="none"
                onSubmitEditing={addWord}
              />
              <Pressable
                onPress={addWord}
                style={[styles.addBtn, { backgroundColor: colors.teamA }]}
              >
                <Ionicons name="add" size={20} color="#FFF" />
              </Pressable>
            </View>
            <View style={styles.wordCloud}>
              {blockedWords.map((word) => (
                <View
                  key={word}
                  style={[styles.wordChip, { backgroundColor: colors.destructive + '20', borderColor: colors.destructive + '44' }]}
                >
                  <Text style={[styles.wordText, { color: colors.destructive }]}>{word}</Text>
                  <Pressable onPress={() => removeWord(word)}>
                    <Ionicons name="close-circle" size={16} color={colors.destructive} />
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  denied: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  deniedTitle: { fontSize: 20, fontFamily: 'PlusJakartaSans_700Bold' },
  deniedBack: { fontSize: 15, fontFamily: 'PlusJakartaSans_500Medium' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  closeBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 20, fontFamily: 'PlusJakartaSans_700Bold' },
  adminChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  adminChipText: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', letterSpacing: 0.5 },
  pillScroll: { maxHeight: 56 },
  pillRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 10 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  pillText: { fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold' },
  content: { padding: 16, gap: 12 },
  grid2: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  list: { gap: 10 },
  pollRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, borderWidth: 1 },
  pollMeta: { flex: 1 },
  pollRoom: { fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold' },
  pollQ: { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', marginTop: 2 },
  editBtn: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, height: 48, borderRadius: 12, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular' },
  sectionHint: { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular' },
  banRow: { flexDirection: 'row', gap: 8 },
  banBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 12, borderRadius: 10 },
  banBtnText: { fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold' },
  reportCard: { padding: 14, borderRadius: 12, borderWidth: 1, gap: 8 },
  reportTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reasonChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  reasonText: { fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold' },
  reportAgo: { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular' },
  reportMsg: { fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', fontStyle: 'italic' },
  reportMeta: { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular' },
  reportActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  actionText: { fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold' },
  filterHint: { fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular' },
  addBtn: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  wordCloud: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  wordChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  wordText: { fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium' },
});

const statStyles = StyleSheet.create({
  card: { width: '47%', padding: 16, borderRadius: 16, borderWidth: 1, gap: 6, alignItems: 'center' },
  val: { fontSize: 22, fontFamily: 'PlusJakartaSans_700Bold' },
  label: { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', textAlign: 'center' },
});
