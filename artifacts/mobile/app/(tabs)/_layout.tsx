import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

const TAB_ITEMS = [
  { name: 'index', label: 'Odalar', icon: 'grid-outline', activeIcon: 'grid' },
  { name: 'leaderboard', label: 'Sıralama', icon: 'trophy-outline', activeIcon: 'trophy' },
  { name: 'profile', label: 'Profil', icon: 'person-outline', activeIcon: 'person' },
] as const;

function FloatingTabBar({ state, navigation }: any) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomOffset = (Platform.OS === 'web' ? 34 : insets.bottom) + 10;

  return (
    <View style={[styles.wrapper, { bottom: bottomOffset }]}>
      <BlurView
        intensity={70}
        tint="dark"
        style={[styles.blur, { borderColor: colors.glassBorder }]}
      >
        <View style={styles.row}>
          {TAB_ITEMS.map((tab, index) => {
            const focused = state.index === index;
            return (
              <Pressable
                key={tab.name}
                onPress={() => navigation.navigate(tab.name)}
                style={styles.tabItem}
              >
                <View
                  style={[
                    styles.tabInner,
                    focused && {
                      backgroundColor: colors.teamA,
                      borderRadius: 16,
                    },
                  ]}
                >
                  <Ionicons
                    name={(focused ? tab.activeIcon : tab.icon) as any}
                    size={21}
                    color={focused ? '#FFFFFF' : colors.mutedForeground}
                  />
                  <Text
                    style={[
                      styles.label,
                      { color: focused ? '#FFFFFF' : colors.mutedForeground },
                    ]}
                  >
                    {tab.label}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="leaderboard" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'absolute', left: 20, right: 20, zIndex: 100 },
  blur: { overflow: 'hidden', borderRadius: 26, borderWidth: 1 },
  row: { flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 8 },
  tabItem: { flex: 1, alignItems: 'center' },
  tabInner: { paddingHorizontal: 14, paddingVertical: 8, alignItems: 'center', gap: 3 },
  label: { fontSize: 10, fontFamily: 'PlusJakartaSans_500Medium' },
});
