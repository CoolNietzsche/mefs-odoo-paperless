import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useAuthStore } from '../../src/store/auth.store';
import { odooService } from '../../src/services/odoo.service';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';
import { Eye, EyeOff, Server, Database, User, Lock, ChevronRight } from 'lucide-react-native';
import { AppConfig } from '../../src/config';
import * as Haptics from 'expo-haptics';

export default function LoginScreen() {
  const [serverUrl, setServerUrl] = useState(AppConfig.defaultServerUrl);
  const [db, setDb] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [dbList, setDbList] = useState<string[]>([]);
  const [isValidatingServer, setIsValidatingServer] = useState(false);
  
  const { login: performLogin, isLoading, error, setError } = useAuthStore();

  const handleServerBlur = async () => {
    if (!serverUrl) return;
    
    let formattedUrl = serverUrl.trim();
    if (!formattedUrl.startsWith('http')) {
      formattedUrl = `https://${formattedUrl}`;
      setServerUrl(formattedUrl);
    }

    setIsValidatingServer(true);
    try {
      odooService.setServerUrl(formattedUrl);
      const dbs = await odooService.getDbList();
      setDbList(dbs);
      if (dbs.length === 1) {
        setDb(dbs[0]);
      }
    } catch (e) {
      console.error('Failed to fetch DB list', e);
    } finally {
      setIsValidatingServer(false);
    }
  };

  const onLogin = async () => {
    if (!serverUrl || !db || !login || !password) {
      Alert.alert('Missing Info', 'Please fill in all fields');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await performLogin(serverUrl, db, login, password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image 
              source={{ uri: 'https://www.odoo.com/web/image/web.site/1/logo' }} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Welcome to Odoo</Text>
          <Text style={styles.subtitle}>Sign in to your workplace</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Server URL</Text>
          <View style={styles.inputContainer}>
            <Server size={20} color={colors.text.muted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="odoo.example.com"
              value={serverUrl}
              onChangeText={setServerUrl}
              onBlur={handleServerBlur}
              autoCapitalize="none"
              keyboardType="url"
              autoCorrect={false}
            />
            {isValidatingServer && <ActivityIndicator size="small" color={colors.primary} />}
          </View>

          <Text style={styles.label}>Database</Text>
          <View style={styles.inputContainer}>
            <Database size={20} color={colors.text.muted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Select or enter database"
              value={db}
              onChangeText={setDb}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <Text style={styles.label}>Email / Username</Text>
          <View style={styles.inputContainer}>
            <User size={20} color={colors.text.muted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="admin@example.com"
              value={login}
              onChangeText={setLogin}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <Lock size={20} color={colors.text.muted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff size={20} color={colors.text.muted} />
              ) : (
                <Eye size={20} color={colors.text.muted} />
              )}
            </TouchableOpacity>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.rememberMeContainer}>
             <TouchableOpacity 
               style={styles.checkboxContainer} 
               onPress={() => setRememberMe(!rememberMe)}
             >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                   {rememberMe && <View style={styles.checkboxInner} />}
                </View>
                <Text style={styles.rememberMeText}>Remember me</Text>
             </TouchableOpacity>
             <TouchableOpacity>
                <Text style={styles.forgotPassword}>Forgot URL?</Text>
             </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={onLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.loginButtonText}>Sign In</Text>
                <ChevronRight size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered by Odoo Community</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: spacing.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold as any,
    color: colors.text.main,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.text.muted,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.text.light,
    marginBottom: 6,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC', // Slate 50
    borderRadius: spacing.borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 56,
    marginBottom: spacing.lg,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.sizes.base,
    color: colors.text.main,
    height: '100%',
  },
  loginButton: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: spacing.borderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold as any,
    marginRight: spacing.xs,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.sizes.sm,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  checkboxInner: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: '#fff',
  },
  rememberMeText: {
    fontSize: 14,
    color: colors.text.muted,
  },
  forgotPassword: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  footer: {
    marginTop: spacing.xxl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: typography.sizes.xs,
    color: colors.text.light,
  }
});
