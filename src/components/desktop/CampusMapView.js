import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme/colors';

export const CampusMapView = () => {
  const { buildings, complaints } = useApp();
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const getBuildingHealth = (activeIssues) => {
    if (activeIssues > 5) return { status: 'Critical', color: COLORS.danger, bg: COLORS.dangerBg };
    if (activeIssues > 2) return { status: 'Warning', color: COLORS.warning, bg: COLORS.warningBg };
    return { status: 'Optimal', color: COLORS.success, bg: COLORS.successBg };
  };

  const getComplaintsForBuilding = (code) => {
    return complaints.filter(c => c.building === code || c.building.includes(code));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Interactive Campus Health Map</Text>
        <Text style={styles.subTitle}>Color-coded building maintenance telemetry (Green/Yellow/Red)</Text>
      </View>

      {/* Map Grid */}
      <View style={styles.mapGrid}>
        {buildings.map((bld) => {
          const bldComplaints = getComplaintsForBuilding(bld.code);
          const health = getBuildingHealth(bldComplaints.length);
          return (
            <TouchableOpacity
              key={bld.id}
              style={[styles.bldCard, { borderColor: health.color, backgroundColor: health.bg }]}
              onPress={() => setSelectedBuilding(bld)}
              activeOpacity={0.8}
            >
              <View style={styles.bldCardTop}>
                <Ionicons name="business-outline" size={24} color={health.color} />
                <View style={[styles.healthBadge, { backgroundColor: health.color }]}>
                  <Text style={styles.healthBadgeText}>{health.status}</Text>
                </View>
              </View>

              <Text style={styles.bldCode}>{bld.code}</Text>
              <Text style={styles.bldName}>{bld.name}</Text>

              <View style={styles.bldFooter}>
                <Text style={{ color: COLORS.secondaryText, fontSize: 11 }}>{bld.floors} Floors · {bld.rooms} Rooms</Text>
                <Text style={[styles.activeVal, { color: health.color }]}>{bldComplaints.length} Active</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Inspection Modal */}
      <Modal visible={!!selectedBuilding} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedBuilding?.code} - {selectedBuilding?.name}</Text>
            <Text style={styles.modalSub}>Active Incident Log for Building</Text>

            <ScrollView style={{ maxHeight: 240, marginVertical: 12 }}>
              {selectedBuilding && getComplaintsForBuilding(selectedBuilding.code).map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemId}>{item.id} · {item.room}</Text>
                    <Text style={styles.itemTitle}>{item.equipment} - {item.problem}</Text>
                  </View>
                  <Text style={styles.itemStatus}>{item.status}</Text>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedBuilding(null)}>
              <Text style={{ color: COLORS.primaryText, fontWeight: 'bold' }}>Close Inspection</Text>
            </TouchableOpacity>
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
  mapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bldCard: {
    width: '49%',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
  },
  bldCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  healthBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  healthBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  bldCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryText,
  },
  bldName: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  bldFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  activeVal: {
    fontSize: 12,
    fontWeight: 'bold',
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
  },
  modalSub: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.secondaryBg,
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemId: {
    fontSize: 10,
    color: COLORS.secondaryText,
    fontWeight: 'bold',
  },
  itemTitle: {
    fontSize: 12,
    color: COLORS.primaryText,
    fontWeight: '600',
  },
  itemStatus: {
    fontSize: 11,
    color: COLORS.primaryText,
    fontWeight: 'bold',
  },
  closeBtn: {
    backgroundColor: COLORS.accent,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.hoverLime,
  },
});
