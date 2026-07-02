import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

interface Props {
  onSend: (text: string) => void;
  team: 'A' | 'B' | 'global';
}

export function ChatInput({ onSend, team }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');

  const accentColor =
    team === 'A' ? colors.teamA : team === 'B' ? colors.teamB : colors.primary;
  const canSend = text.trim().length > 0;

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          paddingBottom: Platform.OS === 'web' ? 34 : insets.bottom + 8,
        },
      ]}
    >
      <View
        style={[
          styles.row,
          {
            backgroundColor: colors.glass,
            borderColor: colors.glassBorder,
            borderRadius: 24,
          },
        ]}
      >
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Mesajınızı yazın..."
          placeholderTextColor={colors.mutedForeground}
          style={[styles.input, { color: colors.foreground }]}
          onSubmitEditing={handleSend}
          returnKeyType="send"
          multiline
          maxLength={500}
        />
        <Pressable
          onPress={handleSend}
          disabled={!canSend}
          style={[
            styles.sendBtn,
            { backgroundColor: canSend ? accentColor : colors.glass },
          ]}
        >
          <Ionicons name="send" size={16} color={canSend ? '#FFFFFF' : colors.mutedForeground} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 10, borderTopWidth: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    borderWidth: 1,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    maxHeight: 90,
    paddingVertical: 4,
  },
  sendBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
