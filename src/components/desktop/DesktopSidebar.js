import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme/colors';

export const DesktopSidebar = () => {
  const { desktopTab, setDesktopTab, complaints, isSseConnected } = useApp();
  const unassignedCount = complaints.filter(c => c.status === 'Submitted').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid-outline', activeIcon: 'grid' },
    { id: 'table', label: 'Dispatch Table', icon: 'list-outline', activeIcon: 'list', badge: unassignedCount },
    { id: 'technicians', label: 'Technician Roster', icon: 'people-outline', activeIcon: 'people' },
    { id: 'map', label: 'Campus Map', icon: 'map-outline', activeIcon: 'map' },
    { id: 'analytics', label: 'SLA Analytics', icon: 'stats-chart-outline', activeIcon: 'stats-chart' },
    { id: 'admin', label: 'Admin Settings', icon: 'options-outline', activeIcon: 'options' },
  ];

  return (
    <View style={styles.sidebar}>
      {/* Brand Header */}
      <View style={styles.brandContainer}>
        <View style={styles.logoIcon}>
          <Ionicons name="sparkles" size={20} color={COLORS.primaryText} />
        </View>
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.brandTitle}>CampusCare AI</Text>
          <Text style={styles.brandSub}>Operations Center</Text>
        </View>
      </View>

      {/* Nav List */}
      <View style={{ marginTop: 20, flex: 1 }}>
        {navItems.map((item) => {
          const isActive = desktopTab === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.navItem, isActive && styles.activeNavItem]}
              onPress={() => setDesktopTab(item.id)}
            >
              <Ionicons
                name={isActive ? item.activeIcon : item.icon}
                size={20}
                color={isActive ? COLORS.primaryText : COLORS.secondaryText}
              />
              <Text style={[styles.navLabel, isActive && styles.activeNavLabel]}>
                {item.label}
              </Text>
              {item.badge > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Real-Time Web Connection Status */}
      <View style={[styles.statusCard, isSseConnected ? styles.statusCardConnected : styles.statusCardDisconnected]}>
        <View style={[styles.statusDot, { backgroundColor: isSseConnected ? '#10B981' : '#F59E0B' }]} />
        <View style={{ marginLeft: 8 }}>
          <Text style={styles.statusTitle}>
            {isSseConnected ? 'Real-Time Connected' : 'Sync Reconnecting...'}
          </Text>
          <Text style={styles.statusSub}>
            {isSseConnected ? 'Live Web SSE Stream' : 'Port 5173 / REST Poll'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 240,
    backgroundColor: COLORS.secondaryBg,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    padding: 16,
    flexDirection: 'column',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryText,
  },
  brandSub: {
    fontSize: 11,
    color: COLORS.secondaryText,
    fontWeight: '600',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 6,
  },
  activeNavItem: {
    backgroundColor: COLORS.accent,
  },
  navLabel: {
    fontSize: 13,
    color: COLORS.secondaryText,
    fontWeight: '500',
    marginLeft: 12,
    flex: 1,
  },
  activeNavLabel: {
    color: COLORS.primaryText,
    fontWeight: 'bold',
  },
  badge: {
    backgroundColor: COLORS.danger,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
  },
  statusCardConnected: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  statusCardDisconnected: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statusSub: {
    fontSize: 9,
    color: '#6B7280',
  },
});

