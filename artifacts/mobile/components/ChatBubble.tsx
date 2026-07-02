import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { UserAvatar } from './UserAvatar';
import type { ChatMessage } from '@/context/AppContext';

interface Props {
  message: ChatMessage;
  isOwn: boolean;
  activeTab: 'A' | 'B' | 'global';
}

export function ChatBubble({ message, isOwn, activeTab }: Props) {
  const colors = useColors();
  const bubbleColor = isOwn
    ? activeTab === 'A'
      ? colors.teamA
      : activeTab === 'B'
        ? colors.teamB
        : colors.primary
    : colors.card;
  const textColor = isOwn ? '#FFFFFF' : colors.foreground;
  const nameColor =
    message.team === 'A'
      ? colors.teamA
      : message.team === 'B'
        ? colors.teamB
        : colors.mutedForeground;
  const time = new Date(message.timestamp).toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={[styles.row, isOwn && styles.rowOwn]}>
      {!isOwn && (
        <UserAvatar
          displayName={message.username}
          size={30}
          team={message.team === 'global' ? null : (message.team as 'A' | 'B')}
        />
      )}
      <View style={[styles.content, isOwn && styles.contentOwn]}>
        {!isOwn && <Text style={[styles.username, { color: nameColor }]}>{message.username}</Text>}
        <View
          style={[
            styles.bubble,
            { backgroundColor: bubbleColor, borderRadius: 16 },
            isOwn && styles.bubbleOwn,
          ]}
        >
          <Text style={[styles.text, { color: textColor }]}>{message.content}</Text>
        </View>
        <Text style={[styles.time, { color: colors.mutedForeground }, isOwn && styles.timeOwn]}>
          {time}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 3, alignItems: 'flex-end' },
  rowOwn: { flexDirection: 'row-reverse' },
  content: { flex: 1, gap: 2, maxWidth: '78%', alignItems: 'flex-start' },
  contentOwn: { alignItems: 'flex-end' },
  username: { fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold', paddingHorizontal: 4 },
  bubble: { paddingHorizontal: 14, paddingVertical: 9 },
  bubbleOwn: { borderBottomRightRadius: 4 },
  text: { fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', lineHeight: 20 },
  time: { fontSize: 10, fontFamily: 'PlusJakartaSans_400Regular', paddingHorizontal: 4 },
  timeOwn: { textAlign: 'right' },
});
