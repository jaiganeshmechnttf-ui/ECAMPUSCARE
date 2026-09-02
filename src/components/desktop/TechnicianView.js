import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme/colors';

export const TechnicianView = () => {
  const { technicians, addTechnician, deleteTechnician } = useApp();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('Electrical & HVAC');
  const [phone, setPhone] = useState('+91 ');

  const handleSaveTech = () => {
    if (!name.trim()) return;
    addTechnician({ name, specialization, phone });
    setIsAddModalVisible(false);
    setName('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Technician Management Roster</Text>
          <Text style={styles.subTitle}>Staff workload, active jobs, and dispatch availability</Text>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={() => setIsAddModalVisible(true)} activeOpacity={0.85}>
          <Ionicons name="person-add-outline" size={18} color={COLORS.primaryText} style={{ marginRight: 6 }} />
          <Text style={styles.addBtnText}>+ Add Technician</Text>
        </TouchableOpacity>
      </View>

      {/* Roster Grid */}
      <View style={styles.grid}>
        {technicians.map((tech) => (
          <View key={tech.id} style={styles.card}>
            <View style={styles.cardTop}>
              <Image source={{ uri: tech.avatar }} style={styles.avatar} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.techName}>{tech.name}</Text>
                <Text style={styles.techSpec}>{tech.specialization}</Text>
                <Text style={styles.techPhone}>{tech.phone}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                tech.status === 'Available' ? { backgroundColor: COLORS.statusResolved } : { backgroundColor: COLORS.statusAssigned }
              ]}>
                <Text style={[
                  styles.statusText,
                  tech.status === 'Available' ? { color: COLORS.statusResolvedText } : { color: COLORS.statusAssignedText }
                ]}>{tech.status}</Text>
              </View>
            </View>

            {/* Metrics */}
            <View style={styles.metricRow}>
              <View style={styles.metricItem}>
                <Text style={styles.metricVal}>{tech.activeJobs}</Text>
                <Text style={styles.metricLabel}>Active Jobs</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={[styles.metricVal, { color: COLORS.success }]}>{tech.completedJobs}</Text>
                <Text style={styles.metricLabel}>Completed</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={[styles.metricVal, { color: COLORS.primaryText }]}>{tech.avgResolution}</Text>
                <Text style={styles.metricLabel}>Avg Time</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.removeBtn} onPress={() => deleteTechnician(tech.id)}>
              <Ionicons name="trash-outline" size={14} color={COLORS.danger} style={{ marginRight: 4 }} />
              <Text style={{ color: COLORS.danger, fontSize: 11 }}>Remove from Roster</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Add Modal */}
      <Modal visible={isAddModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Technician</Text>

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Ramesh Kumar"
              placeholderTextColor={COLORS.secondaryText}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Specialization</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. AV & Smart Displays"
              placeholderTextColor={COLORS.secondaryText}
              value={specialization}
              onChangeText={setSpecialization}
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="+91 98765 00000"
              placeholderTextColor={COLORS.secondaryText}
              value={phone}
              onChangeText={setPhone}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsAddModalVisible(false)}>
                <Text style={{ color: COLORS.secondaryText }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveTech}>
                <Text style={{ color: COLORS.primaryText, fontWeight: 'bold' }}>Save Technician</Text>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  addBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.accent,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.hoverLime,
  },
  addBtnText: {
    color: COLORS.primaryText,
    fontSize: 13,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '49%',
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  techName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primaryText,
  },
  techSpec: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  techPhone: {
    fontSize: 11,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primaryBg,
    borderRadius: 10,
    padding: 10,
    marginTop: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primaryText,
  },
  metricLabel: {
    fontSize: 10,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
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
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: COLORS.primaryText,
    marginBottom: 4,
    marginTop: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 8,
    padding: 10,
    color: COLORS.primaryText,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  cancelBtn: {
    paddingHorizontal: 14,
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
