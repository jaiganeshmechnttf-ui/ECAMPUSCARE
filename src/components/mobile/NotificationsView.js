import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme/colors';

export const NotificationsView = () => {
  const { notifications, setMobileTab } = useApp();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>System Alerts & Notifications</Text>
        <Text style={styles.subTitle}>Real-time updates on ticket assignments and dispatches</Text>
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="notifications-off-outline" size={48} color={COLORS.secondaryText} />
          <Text style={styles.emptyText}>No notifications at this time.</Text>
        </View>
      ) : (
        notifications.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => setMobileTab('requests')}
            activeOpacity={0.8}
          >
            <View style={styles.iconBadge}>
              <Ionicons name="notifications" size={18} color={COLORS.primaryText} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardTime}>{item.time}</Text>
              </View>
              <Text style={styles.cardMsg}>{item.message}</Text>
              {item.complaintId ? (
                <Text style={styles.complaintLink}>Ticket ID: {item.complaintId}</Text>
              ) : null}
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBg,
    padding: 16,
  },
  header: {
    marginBottom: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primaryText,
  },
  subTitle: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    color: COLORS.secondaryText,
    fontSize: 13,
    marginTop: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'flex-start',
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primaryText,
  },
  cardTime: {
    fontSize: 10,
    color: COLORS.secondaryText,
  },
  cardMsg: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginTop: 4,
    lineHeight: 16,
  },
  complaintLink: {
    fontSize: 11,
    color: COLORS.primaryText,
    fontWeight: 'bold',
    marginTop: 6,
    textDecorationLine: 'underline',
  },
});
