import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';

type Tab = 'login' | 'register';

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { login, register, loginWithGoogle } = useAuth();

  const [tab, setTab] = useState<Tab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Eksik bilgi', 'E-posta ve şifre zorunludur');
      return;
    }
    if (tab === 'register' && !displayName.trim()) {
      Alert.alert('Eksik bilgi', 'Kullanıcı adı zorunludur');
      return;
    }
    setLoading(true);
    try {
      if (tab === 'login') {
        await login(email.trim(), password);
      } else {
        await register(email.trim(), password, displayName.trim());
      }
    } catch (e: any) {
      Alert.alert('Hata', e?.message ?? 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (e: any) {
      Alert.alert('Hata', e?.message ?? 'Google girişi başarısız');
    } finally {
      setLoading(false);
    }
  }

  const topPad = (Platform.OS === 'web' ? 67 : insets.top) + 40;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#0A0A0F', '#0F0F22', '#0A0A0F']}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: topPad, paddingBottom: insets.bottom + 32 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoArea}>
            <View style={[styles.logoIconWrap, { backgroundColor: colors.teamA }]}>
              <Ionicons name="chatbubbles" size={34} color="#FFFFFF" />
            </View>
            <Text style={[styles.logoTitle, { color: colors.foreground }]}>Tartışmanya</Text>
            <Text style={[styles.logoTagline, { color: colors.mutedForeground }]}>
              Türkiye'nin #1 Tartışma Platformu
            </Text>
          </View>

          {/* Card */}
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
            {/* Tab switcher */}
            <View style={[styles.tabs, { backgroundColor: colors.muted, borderRadius: 12 }]}>
              <Pressable
                onPress={() => setTab('login')}
                style={[
                  styles.tabBtn,
                  tab === 'login' && { backgroundColor: colors.teamA, borderRadius: 10 },
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: tab === 'login' ? '#FFFFFF' : colors.mutedForeground },
                  ]}
                >
                  Giriş Yap
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setTab('register')}
                style={[
                  styles.tabBtn,
                  tab === 'register' && { backgroundColor: colors.teamB, borderRadius: 10 },
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: tab === 'register' ? '#FFFFFF' : colors.mutedForeground },
                  ]}
                >
                  Kayıt Ol
                </Text>
              </Pressable>
            </View>

            {/* Display name (register only) */}
            {tab === 'register' && (
              <View
                style={[
                  styles.inputRow,
                  { backgroundColor: colors.glass, borderColor: colors.glassBorder, borderRadius: 12 },
                ]}
              >
                <Ionicons name="person-outline" size={18} color={colors.mutedForeground} />
                <TextInput
                  placeholder="Kullanıcı adı"
                  placeholderTextColor={colors.mutedForeground}
                  value={displayName}
                  onChangeText={setDisplayName}
                  style={[styles.input, { color: colors.foreground }]}
                  autoCapitalize="none"
                />
              </View>
            )}

            {/* Email */}
            <View
              style={[
                styles.inputRow,
                { backgroundColor: colors.glass, borderColor: colors.glassBorder, borderRadius: 12 },
              ]}
            >
              <Ionicons name="mail-outline" size={18} color={colors.mutedForeground} />
              <TextInput
                placeholder="E-posta"
                placeholderTextColor={colors.mutedForeground}
                value={email}
                onChangeText={setEmail}
                style={[styles.input, { color: colors.foreground }]}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            {/* Password */}
            <View
              style={[
                styles.inputRow,
                { backgroundColor: colors.glass, borderColor: colors.glassBorder, borderRadius: 12 },
              ]}
            >
              <Ionicons name="lock-closed-outline" size={18} color={colors.mutedForeground} />
              <TextInput
                placeholder="Şifre"
                placeholderTextColor={colors.mutedForeground}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
                style={[styles.input, { color: colors.foreground }]}
              />
              <Pressable onPress={() => setShowPass((v) => !v)}>
                <Ionicons
                  name={showPass ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={colors.mutedForeground}
                />
              </Pressable>
            </View>

            {tab === 'login' && (
              <Pressable style={styles.forgotRow}>
                <Text style={[styles.forgotText, { color: colors.teamA }]}>Şifremi Unuttum</Text>
              </Pressable>
            )}

            {/* Submit */}
            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              style={[
                styles.submitBtn,
                {
                  backgroundColor: tab === 'login' ? colors.teamA : colors.teamB,
                  borderRadius: 14,
                },
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitText}>
                  {tab === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}
                </Text>
              )}
            </Pressable>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>veya</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            {/* Google */}
            <Pressable
              onPress={handleGoogle}
              disabled={loading}
              style={[
                styles.googleBtn,
                {
                  backgroundColor: colors.glass,
                  borderColor: colors.glassBorder,
                  borderRadius: 14,
                },
              ]}
            >
              <Ionicons name="logo-google" size={20} color="#EA4335" />
              <Text style={[styles.googleText, { color: colors.foreground }]}>
                Google ile Giriş
              </Text>
            </Pressable>
          </View>

          <Text style={[styles.demoHint, { color: colors.mutedForeground }]}>
            Demo: admin@tartismanya.com ile admin paneline erişin
          </Text>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 24, gap: 24 },

  logoArea: { alignItems: 'center', gap: 12 },
  logoIconWrap: { width: 76, height: 76, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  logoTitle: { fontSize: 34, fontFamily: 'PlusJakartaSans_700Bold', letterSpacing: -0.5 },
  logoTagline: { fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular' },

  card: { padding: 20, gap: 14, borderWidth: 1 },

  tabs: { flexDirection: 'row', padding: 4 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabText: { fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold' },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
  },
  input: { flex: 1, fontSize: 15, fontFamily: 'PlusJakartaSans_400Regular' },

  forgotRow: { alignSelf: 'flex-end' },
  forgotText: { fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium' },

  submitBtn: { height: 52, alignItems: 'center', justifyContent: 'center' },
  submitText: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#FFFFFF' },

  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular' },

  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    height: 52,
    borderWidth: 1,
  },
  googleText: { fontSize: 15, fontFamily: 'PlusJakartaSans_600SemiBold' },

  demoHint: { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', textAlign: 'center' },
});
