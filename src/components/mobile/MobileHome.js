import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme/colors';

export const MobileHome = () => {
  const { currentUser, complaints, setMobileTab, setPrefilledEquipment, updateUserLocation } = useApp();
  const [isEditLocationModalVisible, setIsEditLocationModalVisible] = useState(false);
  const [newLocationInput, setNewLocationInput] = useState('');

  const activeCount = complaints.filter(c => c.status !== 'Closed' && c.status !== 'Resolved').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;

  const quickCategories = [
    { id: 'AC', name: 'Air Conditioner', icon: 'snow-outline', color: '#202020', bg: '#F2F3F5' },
    { id: 'TV', name: 'Smart Display / TV', icon: 'tv-outline', color: '#202020', bg: '#F2F3F5' },
    { id: 'Projector', name: 'LCD Projector', icon: 'videocam-outline', color: '#202020', bg: '#F2F3F5' },
    { id: 'Electrical', name: 'Power & Lights', icon: 'flash-outline', color: '#202020', bg: '#F2F3F5' },
    { id: 'Network', name: 'Wi-Fi / Internet', icon: 'wifi-outline', color: '#202020', bg: '#F2F3F5' },
    { id: 'Other', name: 'Furniture / Other', icon: 'build-outline', color: '#202020', bg: '#F2F3F5' },
  ];

  const handleCategoryPress = (category) => {
    setPrefilledEquipment(category);
    setMobileTab('report');
  };

  const handleSaveLocation = () => {
    if (newLocationInput.trim()) {
      updateUserLocation(newLocationInput.trim());
      setIsEditLocationModalVisible(false);
      setNewLocationInput('');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      {/* Header Banner */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{currentUser?.name || 'Prof. Sarah Jenkins'}</Text>
          <Text style={styles.userRole}>{currentUser?.department || 'Computer Science'}</Text>
        </View>
        <TouchableOpacity style={styles.aiButton} onPress={() => setMobileTab('ai')} activeOpacity={0.8}>
          <Ionicons name="sparkles" size={18} color={COLORS.primaryText} />
          <Text style={styles.aiButtonText}>AI Assistant</Text>
        </TouchableOpacity>
      </View>

      {/* Active Classroom Location Card */}
      <View style={styles.locationCard}>
        <View style={styles.locationHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="location" size={18} color={COLORS.primaryText} />
            <Text style={styles.locationTitle}>Active Classroom Location</Text>
          </View>
          <TouchableOpacity onPress={() => setIsEditLocationModalVisible(true)}>
            <Text style={styles.editBtn}>Edit</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.locationText}>
          {currentUser?.defaultBuilding || 'Block A'} · {currentUser?.defaultRoom || 'Room 302'} · {currentUser?.defaultFloor || '3rd Floor'}
        </Text>
        <Text style={styles.locationSub}>Auto-attached to all new maintenance requests</Text>
      </View>

      {/* Quick Metrics */}
      <View style={styles.metricsRow}>
        <View style={styles.metricBox}>
          <Text style={styles.metricVal}>{activeCount}</Text>
          <Text style={styles.metricLabel}>Active Tickets</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={[styles.metricVal, { color: COLORS.statusAssignedText }]}>{inProgressCount}</Text>
          <Text style={styles.metricLabel}>In Progress</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={[styles.metricVal, { color: COLORS.statusResolvedText }]}>{resolvedCount}</Text>
          <Text style={styles.metricLabel}>Resolved</Text>
        </View>
      </View>

      {/* Quick Report Category Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Report an Issue</Text>
        <Text style={styles.sectionSub}>Select equipment category</Text>
      </View>

      <View style={styles.categoryGrid}>
        {quickCategories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={styles.categoryCard}
            onPress={() => handleCategoryPress(cat.id)}
            activeOpacity={0.75}
          >
            <View style={styles.categoryIconCircle}>
              <Ionicons name={cat.icon} size={22} color={COLORS.primaryText} />
            </View>
            <Text style={styles.categoryName}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Complaints Stream */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Incidents</Text>
        <TouchableOpacity onPress={() => setMobileTab('requests')}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {complaints.slice(0, 3).map((item) => (
        <View key={item.id} style={styles.complaintCard}>
          <View style={styles.complaintTop}>
            <Text style={styles.complaintId}>{item.id}</Text>
            <View style={[
              styles.statusBadge,
              item.status === 'In Progress' && { backgroundColor: COLORS.statusInProgress },
              item.status === 'Resolved' && { backgroundColor: COLORS.statusResolved },
              item.status === 'Closed' && { backgroundColor: COLORS.statusClosed },
              item.status === 'Submitted' && { backgroundColor: COLORS.statusSubmitted },
            ]}>
              <Text style={[
                styles.statusText,
                item.status === 'In Progress' && { color: COLORS.statusInProgressText },
                item.status === 'Resolved' && { color: COLORS.statusResolvedText },
                item.status === 'Closed' && { color: COLORS.statusClosedText },
                item.status === 'Submitted' && { color: COLORS.statusSubmittedText },
              ]}>{item.status}</Text>
            </View>
          </View>

          <Text style={styles.complaintTitle}>{item.equipment} - {item.problem}</Text>
          <Text style={styles.complaintLoc}>{item.building} · {item.room}</Text>

          <View style={styles.complaintFooter}>
            <Text style={styles.complaintTime}>{item.reportedTime}</Text>
            {item.assignedTech ? (
              <Text style={styles.techText}>Assigned: {item.assignedTech}</Text>
            ) : (
              <Text style={styles.techText}>Awaiting Dispatch</Text>
            )}
          </View>
        </View>
      ))}

      {/* Edit Location Modal */}
      <Modal visible={isEditLocationModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Classroom Location</Text>
            <Text style={styles.modalSub}>Enter your current room (e.g. Room 302, Room 204)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Room 302"
              placeholderTextColor={COLORS.secondaryText}
              value={newLocationInput}
              onChangeText={setNewLocationInput}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsEditLocationModalVisible(false)}>
                <Text style={{ color: COLORS.secondaryText }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveLocation}>
                <Text style={{ color: COLORS.primaryText, fontWeight: 'bold' }}>Save Location</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 8,
  },
  greeting: {
    fontSize: 12,
    color: COLORS.secondaryText,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryText,
  },
  userRole: {
    fontSize: 12,
    color: COLORS.secondaryText,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.hoverLime,
  },
  aiButtonText: {
    color: COLORS.primaryText,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  locationCard: {
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationTitle: {
    color: COLORS.primaryText,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  editBtn: {
    color: COLORS.primaryText,
    fontSize: 12,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  locationText: {
    color: COLORS.primaryText,
    fontSize: 15,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  locationSub: {
    color: COLORS.secondaryText,
    fontSize: 11,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricBox: {
    flex: 1,
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metricVal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primaryText,
  },
  metricLabel: {
    fontSize: 10,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryText,
  },
  sectionSub: {
    fontSize: 11,
    color: COLORS.secondaryText,
  },
  viewAll: {
    fontSize: 12,
    color: COLORS.primaryText,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primaryText,
    textAlign: 'center',
  },
  complaintCard: {
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  complaintTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  complaintId: {
    fontSize: 11,
    color: COLORS.secondaryText,
    fontWeight: 'bold',
  },
  statusBadge: {
    backgroundColor: COLORS.secondaryBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    color: COLORS.primaryText,
    fontWeight: 'bold',
  },
  complaintTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primaryText,
    marginBottom: 2,
  },
  complaintLoc: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginBottom: 8,
  },
  complaintFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
  complaintTime: {
    fontSize: 10,
    color: COLORS.secondaryText,
  },
  techText: {
    fontSize: 10,
    color: COLORS.primaryText,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: COLORS.primaryBg,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryText,
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginBottom: 16,
  },
  input: {
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 8,
    padding: 12,
    color: COLORS.primaryText,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
  },
  saveBtn: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.hoverLime,
  },
});
