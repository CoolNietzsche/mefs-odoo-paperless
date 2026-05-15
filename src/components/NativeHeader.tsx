import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform 
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { ChevronLeft, Search, User } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useAuthStore } from '../store/auth.store';

interface NativeHeaderProps {
  title: string;
  showBack?: boolean;
  onLeftPress?: () => void;
  onRightPress?: () => void;
}

export default function NativeHeader({ title, showBack, onLeftPress, onRightPress }: NativeHeaderProps) {
  const { session } = useAuthStore();

  const HeaderContent = () => (
    <View style={styles.headerContent}>
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity onPress={onLeftPress} style={styles.iconButton}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
      </View>
      
      <View style={styles.right}>
        <TouchableOpacity style={styles.iconButton}>
          <Search size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.avatarButton}>
          <View style={styles.avatarPlaceholder}>
             <User size={16} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (Platform.OS === 'ios') {
    return (
      <View style={[styles.container, { backgroundColor: colors.primary }]}>
        <HeaderContent />
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.containerAndroid]}>
      <HeaderContent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  containerAndroid: {
    backgroundColor: colors.surface,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  left: {
    flex: 1,
    alignItems: 'flex-start',
  },
  center: {
    flex: 3,
    alignItems: 'center',
  },
  right: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text.main,
  },
  iconButton: {
    padding: 8,
    marginRight: 4,
  },
  avatarButton: {
    marginLeft: 8,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  }
});
