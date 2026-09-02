import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme/colors';

export const ProfileView = () => {
  const { currentUser, logout, updateUserLocation, clearAllHistory, isSseConnected } = useApp();
  const [editingLocation, setEditingLocation] = useState(false);
  const [roomInput, setRoomInput] = useState(currentUser?.defaultRoom || 'Room 302');

  const handleSaveLoc = () => {
    updateUserLocation(roomInput);
    setEditingLocation(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitial}>
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
        <Text style={styles.userName}>{currentUser?.name || 'Prof. Sarah Jenkins'}</Text>
        <Text style={styles.userRole}>{currentUser?.role?.toUpperCase() || 'FACULTY'} · {currentUser?.department || 'Computer Science'}</Text>
        <Text style={styles.userEmail}>{currentUser?.email || 'sarah.jenkins@university.edu'}</Text>
      </View>

      {/* Classroom Location Manager */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Ionicons name="location-outline" size={20} color={COLORS.primaryText} />
          <Text style={styles.sectionTitle}>Default Classroom Location</Text>
        </View>

        {editingLocation ? (
          <View style={{ marginTop: 10 }}>
            <TextInput
              style={styles.input}
              value={roomInput}
              onChangeText={setRoomInput}
              placeholder="e.g. Room 302"
              placeholderTextColor={COLORS.secondaryText}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditingLocation(false)}>
                <Text style={{ color: COLORS.secondaryText }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveLoc}>
                <Text style={{ color: COLORS.primaryText, fontWeight: 'bold' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.locRow}>
            <View>
              <Text style={styles.locBuilding}>{currentUser?.defaultBuilding || 'Block A'}</Text>
              <Text style={styles.locRoom}>{currentUser?.defaultRoom || 'Room 302'} · {currentUser?.defaultFloor || '3rd Floor'}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={() => setEditingLocation(true)}>
              <Text style={styles.editBtnText}>Edit Room</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* System Settings & Server Sync */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Ionicons name="settings-outline" size={20} color={COLORS.primaryText} />
          <Text style={styles.sectionTitle}>System & Server Settings</Text>
        </View>

        <View style={styles.serverStatusRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.serverStatusLabel}>Real-Time Sync Status</Text>
            <Text style={styles.serverStatusSub}>
              {isSseConnected ? '🟢 Connected to Node Sync Server' : '🔴 Connecting to http://<PC_IP>:5173...'}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.actionItem} onPress={clearAllHistory}>
          <Ionicons name="trash-bin-outline" size={18} color={COLORS.danger} />
          <Text style={[styles.actionText, { color: COLORS.danger }]}>Clear All Complaint History</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.85}>
        <Ionicons name="log-out-outline" size={20} color={COLORS.primaryText} style={{ marginRight: 8 }} />
        <Text style={styles.logoutText}>Sign Out of CampusCare AI</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBg,
    padding: 16,
  },
  profileCard: {
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.hoverLime,
  },
  avatarInitial: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primaryText,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryText,
  },
  userRole: {
    fontSize: 11,
    color: COLORS.primaryText,
    fontWeight: '600',
    marginTop: 2,
  },
  userEmail: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primaryText,
    marginLeft: 8,
  },
  locRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locBuilding: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primaryText,
  },
  locRoom: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  editBtn: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.hoverLime,
  },
  editBtnText: {
    color: COLORS.primaryText,
    fontSize: 11,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: COLORS.primaryBg,
    borderRadius: 8,
    padding: 10,
    color: COLORS.primaryText,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
  },
  saveBtn: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.hoverLime,
  },
  serverStatusRow: {
    paddingVertical: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  serverStatusLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primaryText,
  },
  serverStatusSub: {
    fontSize: 11,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  actionText: {
    fontSize: 13,
    marginLeft: 10,
    fontWeight: '500',
  },
  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.hoverLime,
  },
  logoutText: {
    color: COLORS.primaryText,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
