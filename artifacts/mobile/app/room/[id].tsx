import React, { useCallback, useState } from 'react';
import { FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { PollCard } from '@/components/PollCard';
import { ChatBubble } from '@/components/ChatBubble';
import { ChatInput } from '@/components/ChatInput';
import type { ChatMessage } from '@/context/AppContext';

type ChatTab = 'A' | 'B' | 'global';

const TAB_DEFS: { key: ChatTab; icon: string }[] = [
  { key: 'A', icon: 'people' },
  { key: 'B', icon: 'people' },
  { key: 'global', icon: 'earth' },
];

export default function RoomScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { rooms, getVote, castVote, getMessages, sendMessage } = useApp();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<ChatTab>('global');

  const room = rooms.find((r) => r.id === id);
  const vote = id ? getVote(id) : null;
  const messages = id ? getMessages(id, activeTab) : [];

  const handleVote = useCallback(
    async (team: 'A' | 'B') => {
      if (id) await castVote(id, team);
    },
    [id, castVote],
  );

  const handleSend = useCallback(
    (text: string) => {
      if (!user || !id) return;
      sendMessage(id, activeTab, text, user.uid, user.displayName);
    },
    [id, activeTab, user, sendMessage],
  );

  if (!room) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.mutedForeground} />
        <Text style={[styles.notFoundText, { color: colors.foreground }]}>Oda bulunamadı</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.goBack, { color: colors.teamA }]}>Geri Dön</Text>
        </Pressable>
      </View>
    );
  }

  const canChat = vote !== null;
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  function getTabLabel(tab: ChatTab): string {
    if (tab === 'A') return `A · ${room!.poll.optionA}`;
    if (tab === 'B') return `B · ${room!.poll.optionB}`;
    return 'Global';
  }

  function getTabColor(tab: ChatTab): string {
    if (tab === 'A') return colors.teamA;
    if (tab === 'B') return colors.teamB;
    return colors.foreground;
  }

  function renderMessage({ item }: { item: ChatMessage }) {
    return (
      <ChatBubble
        message={item}
        isOwn={item.userId === user?.uid}
        activeTab={activeTab}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Room header */}
      <LinearGradient
        colors={room.gradient}
        style={[styles.roomHeader, { paddingTop: topPad + 8 }]}
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </Pressable>
        <View style={[styles.roomIconWrap, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
          <Ionicons name={room.icon as any} size={24} color="#FFFFFF" />
        </View>
        <View style={styles.roomTitleWrap}>
          <Text style={styles.roomTitle}>{room.name}</Text>
          <View style={styles.onlineRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>
              {room.activeUsers.toLocaleString('tr-TR')} aktif
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Poll card */}
      <View style={{ marginTop: 16 }}>
        <PollCard room={room} vote={vote} onVote={handleVote} />
      </View>

      {/* Chat tabs */}
      <View
        style={[styles.chatTabBar, { backgroundColor: colors.card, borderColor: colors.glassBorder }]}
      >
        {TAB_DEFS.map((t) => {
          const focused = activeTab === t.key;
          const col = getTabColor(t.key);
          return (
            <Pressable
              key={t.key}
              onPress={() => setActiveTab(t.key)}
              style={[
                styles.chatTab,
                focused && { borderBottomWidth: 2, borderBottomColor: col },
              ]}
            >
              <Text
                style={[
                  styles.chatTabText,
                  { color: focused ? col : colors.mutedForeground },
                ]}
                numberOfLines={1}
              >
                {getTabLabel(t.key)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Messages */}
      {canChat ? (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          inverted
          contentContainerStyle={styles.msgList}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
        />
      ) : (
        <View style={styles.noVotePrompt}>
          <Ionicons name="chatbubbles-outline" size={52} color={colors.mutedForeground} />
          <Text style={[styles.promptTitle, { color: colors.foreground }]}>Önce oy ver!</Text>
          <Text style={[styles.promptSub, { color: colors.mutedForeground }]}>
            Oy verdikten sonra sohbete katılabilirsiniz.
          </Text>
        </View>
      )}

      {/* Input */}
      {canChat && <ChatInput onSend={handleSend} team={activeTab} />}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  notFoundText: { fontSize: 17, fontFamily: 'PlusJakartaSans_600SemiBold' },
  goBack: { fontSize: 15, fontFamily: 'PlusJakartaSans_500Medium' },
  roomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  roomIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomTitleWrap: { flex: 1 },
  roomTitle: { fontSize: 22, fontFamily: 'PlusJakartaSans_700Bold', color: '#FFFFFF' },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E' },
  onlineText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.7)',
  },
  chatTabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginTop: 16,
  },
  chatTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  chatTabText: { fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold' },
  msgList: { paddingVertical: 8 },
  noVotePrompt: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 40 },
  promptTitle: { fontSize: 18, fontFamily: 'PlusJakartaSans_700Bold' },
  promptSub: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    textAlign: 'center',
    lineHeight: 22,
  },
});
