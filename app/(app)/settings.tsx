import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Image } from 'react-native';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';
import { useAuthStore } from '../../src/store/auth.store';
import { 
  User, 
  ChevronRight, 
  Bell, 
  Lock, 
  Smartphone, 
  Info, 
  LogOut, 
  ShieldCheck,
  Moon,
  Trash2
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { session, logout } = useAuthStore();
  const [biometrics, setBiometrics] = React.useState(true);
  const [dark, setDark] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);

  if (!session) return null;

  const SettingItem = ({ icon: Icon, title, value, type = 'link', onPress, color = colors.text.main }: any) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <Icon size={20} color={color} />
      </View>
      <View style={styles.itemContent}>
        <Text style={[styles.itemText, { color }]}>{title}</Text>
      </View>
      {type === 'link' && <ChevronRight size={20} color={colors.text.light} />}
      {type === 'switch' && (
        <Switch 
          value={value} 
          onValueChange={onPress}
          trackColor={{ false: '#eee', true: colors.primary + '50' }}
          thumbColor={value ? colors.primary : '#fff'}
        />
      )}
    </TouchableOpacity>
  );

  const Section = ({ title, children }: any) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>
        {children}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{session.name.charAt(0)}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{session.name}</Text>
            <Text style={styles.profileEmail}>{session.username}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Connected to {new URL(session.server_url).hostname}</Text>
            </View>
          </View>
        </View>
      </View>

      <Section title="Account">
        <SettingItem icon={User} title="Edit Odoo Profile" />
        <SettingItem icon={Smartphone} title="Switch Server" />
      </Section>

      <Section title="Security">
        <SettingItem 
          icon={ShieldCheck} 
          title="Face ID / Fingerprint" 
          type="switch" 
          value={biometrics}
          onPress={() => setBiometrics(!biometrics)}
        />
        <SettingItem icon={Lock} title="App Lock Timeout" />
      </Section>

      <Section title="Interface">
        <SettingItem 
          icon={Bell} 
          title="Push Notifications" 
          type="switch" 
          value={notifications}
          onPress={() => setNotifications(!notifications)}
        />
        <SettingItem 
          icon={Moon} 
          title="Dark Mode" 
          type="switch" 
          value={dark}
          onPress={() => setDark(!dark)}
        />
      </Section>

      <Section title="Storage & Backup">
        <SettingItem icon={Trash2} title="Clear WebView Cache" />
      </Section>

      <Section title="Support">
        <SettingItem icon={Info} title="App Version" value="1.0.0" type="text" />
      </Section>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <LogOut size={20} color={colors.error} />
        <Text style={styles.logoutText}>Logout from Workplace</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: spacing.md,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  avatarText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  profileInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.main,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.text.muted,
    marginTop: 2,
  },
  badge: {
    marginTop: 8,
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
  },
  section: {
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.text.light,
    textTransform: 'uppercase',
    marginLeft: spacing.lg,
    marginBottom: spacing.sm,
    letterSpacing: 1.5,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    marginHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xs,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    paddingHorizontal: spacing.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  itemContent: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    color: colors.text.main,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    marginTop: spacing.xxl,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  logoutText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  bottomSpacer: {
    height: 120, // Tab bar space
  }
});
