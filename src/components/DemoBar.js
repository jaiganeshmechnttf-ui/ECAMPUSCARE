import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS } from '../theme/colors';

export const DemoBar = () => {
  const { viewMode, setViewMode, userRole, runLiveDemo, isDemoRunning, toastMessage, showToast, isSseConnected } = useApp();

  return (
    <View style={styles.container}>
      {/* Role & View Toggle */}
      <View style={styles.leftGroup}>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{userRole.toUpperCase()}</Text>
        </View>

        <TouchableOpacity
          style={[styles.toggleBtn, viewMode === 'mobile' && styles.activeToggle]}
          onPress={() => setViewMode('mobile')}
        >
          <Ionicons name="phone-portrait-outline" size={14} color={viewMode === 'mobile' ? COLORS.primaryText : COLORS.secondaryText} />
          <Text style={[styles.toggleText, viewMode === 'mobile' && styles.activeToggleText]}>Mobile APK</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleBtn,
            viewMode === 'desktop' && styles.activeToggle,
            userRole !== 'admin' && { opacity: 0.6 }
          ]}
          onPress={() => {
            if (userRole !== 'admin') {
              showToast('🔒 Access Denied: Web Operations is restricted to System Admin users only.', 'warning');
              return;
            }
            setViewMode('desktop');
          }}
        >
          <Ionicons name={userRole === 'admin' ? "desktop-outline" : "lock-closed-outline"} size={14} color={viewMode === 'desktop' ? COLORS.primaryText : COLORS.secondaryText} />
          <Text style={[styles.toggleText, viewMode === 'desktop' && styles.activeToggleText]}>
            {userRole === 'admin' ? 'Web Operations' : 'Web Operations (Admin Only)'}
          </Text>
        </TouchableOpacity>

        {/* Real-time Web Connection Indicator */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, backgroundColor: isSseConnected ? '#ECFDF5' : '#FFFBEB' }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: isSseConnected ? '#10B981' : '#F59E0B', marginRight: 4 }} />
          <Text style={{ fontSize: 9, fontWeight: 'bold', color: isSseConnected ? '#065F46' : '#92400E' }}>
            {isSseConnected ? 'LIVE WEB SYNC' : 'RECONNECTING'}
          </Text>
        </View>
      </View>

      {/* Demo Scenario Button */}
      <TouchableOpacity
        style={[styles.demoBtn, isDemoRunning && { opacity: 0.6 }]}
        onPress={runLiveDemo}
        disabled={isDemoRunning}
      >
        <Ionicons name="play" size={14} color={COLORS.primaryText} style={{ marginRight: 4 }} />
        <Text style={styles.demoText}>{isDemoRunning ? 'Running Demo...' : '30-Sec Live Demo'}</Text>
      </TouchableOpacity>

      {/* Toast Overlay */}
      {toastMessage && (
        <View style={[
          styles.toast,
          toastMessage.type === 'success' && { backgroundColor: COLORS.success },
          toastMessage.type === 'warning' && { backgroundColor: COLORS.warning },
          toastMessage.type === 'info' && { backgroundColor: COLORS.primaryText },
        ]}>
          <Text style={styles.toastText}>{toastMessage.message}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.secondaryBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    position: 'relative',
    zIndex: 100,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 8,
  },
  roleText: {
    color: COLORS.primaryText,
    fontSize: 10,
    fontWeight: 'bold',
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 4,
  },
  activeToggle: {
    backgroundColor: COLORS.accent,
  },
  toggleText: {
    fontSize: 11,
    color: COLORS.secondaryText,
    marginLeft: 4,
  },
  activeToggleText: {
    color: COLORS.primaryText,
    fontWeight: 'bold',
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.hoverLime,
  },
  demoText: {
    color: COLORS.primaryText,
    fontSize: 11,
    fontWeight: 'bold',
  },
  toast: {
    position: 'absolute',
    top: 45,
    left: 20,
    right: 20,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    elevation: 10,
    zIndex: 999,
  },
  toastText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
