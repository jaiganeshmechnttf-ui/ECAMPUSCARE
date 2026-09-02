import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS } from '../theme/colors';

export const AccessDeniedView = () => {
  const { userRole, setViewMode, logout } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons name="lock-closed" size={36} color={COLORS.danger} />
        </View>

        <Text style={styles.title}>Web Operations Access Restricted</Text>

        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>Current Role: {userRole ? userRole.toUpperCase() : 'USER'}</Text>
        </View>

        <Text style={styles.description}>
          The Web Operations Control Center is strictly reserved for <Text style={{ fontWeight: 'bold' }}>System Admin</Text> accounts. Your current account (<Text style={{ fontWeight: 'bold' }}>{userRole}</Text>) does not have permission to view or manage dispatch operations on the desktop dashboard.
        </Text>

        <TouchableOpacity style={styles.primaryBtn} onPress={() => setViewMode('mobile')}>
          <Ionicons name="phone-portrait-outline" size={18} color={COLORS.primaryText} style={{ marginRight: 8 }} />
          <Text style={styles.primaryBtnText}>Return to Mobile App</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={16} color={COLORS.secondaryText} style={{ marginRight: 6 }} />
          <Text style={styles.secondaryBtnText}>Sign Out & Log In as System Admin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    maxWidth: 480,
    width: '100%',
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 4,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primaryText,
    textAlign: 'center',
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: COLORS.statusAssigned,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.statusAssignedText,
  },
  description: {
    fontSize: 13,
    color: COLORS.secondaryText,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.hoverLime,
    marginBottom: 12,
  },
  primaryBtnText: {
    color: COLORS.primaryText,
    fontSize: 14,
    fontWeight: 'bold',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 10,
  },
  secondaryBtnText: {
    color: COLORS.secondaryText,
    fontSize: 13,
    fontWeight: '600',
  },
});
