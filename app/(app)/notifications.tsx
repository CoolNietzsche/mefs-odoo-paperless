import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { Bell, MessageSquare, Info, ChevronRight, Filter } from 'lucide-react-native';

export default function NotificationsScreen() {
  const notifications = [
    {
      id: 1,
      type: 'message',
      title: 'New Chatter Message',
      body: 'Mitchell Admin left a comment on SO0042: "Please check the stock levels."',
      time: '2m ago',
      read: false
    },
    {
      id: 2,
      type: 'activity',
      title: 'Activity Reminder',
      body: 'Meeting for "Sales Dashboard" starts in 15 minutes.',
      time: '15m ago',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'System Update',
      body: 'Inventory module updated to version 18.0.4. Review changelog.',
      time: '1h ago',
      read: true
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity>
          <Filter size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.scroll}>
        {notifications.map(item => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.notifCard, !item.read && styles.unreadCard]}
          >
            <View style={[styles.iconBox, { backgroundColor: item.type === 'message' ? colors.secondary + '15' : colors.primary + '15' }]}>
               {item.type === 'message' ? (
                 <MessageSquare size={20} color={colors.secondary} />
               ) : item.type === 'activity' ? (
                 <Bell size={20} color={colors.primary} />
               ) : (
                 <Info size={20} color={colors.info} />
               )}
            </View>
            <View style={styles.content}>
               <View style={styles.row}>
                  <Text style={styles.notifTitle}>{item.title}</Text>
                  <Text style={styles.time}>{item.time}</Text>
               </View>
               <Text style={styles.body} numberOfLines={2}>{item.body}</Text>
            </View>
            {!item.read && <View style={styles.dot} />}
          </TouchableOpacity>
        ))}
        
        {notifications.length === 0 && (
          <View style={styles.empty}>
            <Bell size={64} color={colors.text.light} />
            <Text style={styles.emptyText}>All caught up!</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.main,
  },
  scroll: {
    padding: spacing.md,
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 16,
    marginBottom: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  unreadCard: {
    backgroundColor: '#F8FAFC',
    borderColor: colors.primary + '30',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.main,
  },
  time: {
    fontSize: 12,
    color: colors.text.muted,
  },
  body: {
    fontSize: 14,
    color: colors.text.muted,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
  },
  empty: {
    flex: 1,
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    color: colors.text.light,
    fontSize: 16,
  }
});
