import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme/colors';
import { TicketDetailModal } from './TicketDetailModal';

export const OperationsTable = () => {
  const { complaints, technicians, assignTechnician, updateComplaintStatus, deleteComplaint } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [assignModalTicket, setAssignModalTicket] = useState(null);
  const [selectedDetailTicket, setSelectedDetailTicket] = useState(null);

  const filtered = complaints.filter(c => {
    const matchesSearch = c.id.toLowerCase().includes(search.toLowerCase()) ||
      (c.tokenNo && c.tokenNo.toLowerCase().includes(search.toLowerCase())) ||
      c.equipment.toLowerCase().includes(search.toLowerCase()) ||
      c.building.toLowerCase().includes(search.toLowerCase()) ||
      c.room.toLowerCase().includes(search.toLowerCase()) ||
      c.reportedBy.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAssignTech = (techName) => {
    if (assignModalTicket) {
      assignTechnician(assignModalTicket.id, techName);
      setAssignModalTicket(null);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Incident Dispatch & Management Table</Text>
        <Text style={styles.subTitle}>Click any row to read full details, assign technicians & track live status</Text>
      </View>

      {/* Filter & Search Bar */}
      <View style={styles.filterBar}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={16} color={COLORS.secondaryText} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Token No, ticket ID, equipment, building, room, faculty..."
            placeholderTextColor={COLORS.secondaryText}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusPillRow}>
          {['All', 'Submitted', 'Assigned', 'In Progress', 'Resolved', 'Closed'].map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.statusPill, statusFilter === s && styles.activeStatusPill]}
              onPress={() => setStatusFilter(s)}
            >
              <Text style={[styles.statusPillText, statusFilter === s && styles.activeStatusPillText]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Table Stream */}
      <ScrollView style={styles.tableScroll}>
        {filtered.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.row}
            onPress={() => setSelectedDetailTicket(item)}
            activeOpacity={0.8}
          >
            {/* Left Info */}
            <View style={{ flex: 2 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                <View style={styles.tokenPill}>
                  <Text style={styles.tokenPillText}>Token #{item.tokenNo || item.id}</Text>
                </View>
                <Text style={styles.ticketId}>{item.id}</Text>
                <View style={[
                  styles.priorityBadge,
                  item.priority === 'Critical' && { backgroundColor: COLORS.priorityCritical },
                  item.priority === 'High' && { backgroundColor: COLORS.priorityHigh },
                  item.priority === 'Medium' && { backgroundColor: COLORS.priorityMedium },
                  item.priority === 'Low' && { backgroundColor: COLORS.priorityLow },
                ]}>
                  <Text style={[
                    styles.priorityText,
                    item.priority === 'Critical' && { color: COLORS.priorityCriticalText },
                    item.priority === 'High' && { color: COLORS.priorityHighText },
                    item.priority === 'Medium' && { color: COLORS.priorityMediumText },
                    item.priority === 'Low' && { color: COLORS.priorityLowText },
                  ]}>{item.priority}</Text>
                </View>
              </View>
              <Text style={styles.equipmentTitle}>{item.equipment} - {item.problem}</Text>
              <Text style={styles.locSub}>{item.building} · {item.room} · {item.floor}</Text>
            </View>

            {/* Reporter Info */}
            <View style={{ flex: 1.2 }}>
              <Text style={styles.colLabel}>Reported By</Text>
              <Text style={styles.colValue}>{item.reportedBy}</Text>
              <Text style={styles.timeSub}>{item.reportedTime}</Text>
            </View>

            {/* Assigned Tech */}
            <View style={{ flex: 1.5 }}>
              <Text style={styles.colLabel}>Assigned Technician</Text>
              {item.assignedTech ? (
                <Text style={styles.techVal}>{item.assignedTech}</Text>
              ) : (
                <TouchableOpacity style={styles.assignBtn} onPress={(e) => { e.stopPropagation(); setAssignModalTicket(item); }}>
                  <Text style={styles.assignBtnText}>+ Assign Tech</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Status & Actions */}
            <View style={{ flex: 1.2, alignItems: 'flex-end' }}>
              <View style={[
                styles.statusBadge,
                item.status === 'Submitted' && { backgroundColor: COLORS.statusSubmitted },
                item.status === 'Assigned' && { backgroundColor: COLORS.statusAssigned },
                item.status === 'In Progress' && { backgroundColor: COLORS.statusInProgress },
                item.status === 'Resolved' && { backgroundColor: COLORS.statusResolved },
                item.status === 'Closed' && { backgroundColor: COLORS.statusClosed },
              ]}>
                <Text style={[
                  styles.statusText,
                  item.status === 'Submitted' && { color: COLORS.statusSubmittedText },
                  item.status === 'Assigned' && { color: COLORS.statusAssignedText },
                  item.status === 'In Progress' && { color: COLORS.statusInProgressText },
                  item.status === 'Resolved' && { color: COLORS.statusResolvedText },
                  item.status === 'Closed' && { color: COLORS.statusClosedText },
                ]}>{item.status}</Text>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.inspectBtn}
                  onPress={(e) => { e.stopPropagation(); setSelectedDetailTicket(item); }}
                >
                  <Ionicons name="eye-outline" size={14} color={COLORS.primaryText} />
                  <Text style={styles.inspectBtnText}>Read</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ marginLeft: 6 }} onPress={(e) => { e.stopPropagation(); deleteComplaint(item.id); }}>
                  <Ionicons name="trash-outline" size={14} color={COLORS.danger} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Ticket Full Inspection Modal */}
      <TicketDetailModal
        ticket={selectedDetailTicket}
        visible={!!selectedDetailTicket}
        onClose={() => setSelectedDetailTicket(null)}
        onAssignClick={(ticket) => setAssignModalTicket(ticket)}
      />

      {/* Technician Assignment Modal */}
      <Modal visible={!!assignModalTicket} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Dispatch Technician</Text>
            <Text style={styles.modalSub}>
              Select technician for ticket {assignModalTicket?.id} ({assignModalTicket?.equipment})
            </Text>

            {technicians.map((tech) => (
              <TouchableOpacity
                key={tech.id}
                style={styles.techOption}
                onPress={() => handleAssignTech(tech.name)}
              >
                <View>
                  <Text style={styles.techName}>{tech.name}</Text>
                  <Text style={styles.techSpec}>{tech.specialization} · Avg {tech.avgResolution}</Text>
                </View>
                <View style={[
                  styles.statusDot,
                  tech.status === 'Available' ? { backgroundColor: COLORS.success } : { backgroundColor: COLORS.warning }
                ]} />
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setAssignModalTicket(null)}>
              <Text style={{ color: COLORS.secondaryText }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
  filterBar: {
    marginBottom: 14,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    color: COLORS.primaryText,
    fontSize: 13,
  },
  statusPillRow: {
    flexDirection: 'row',
  },
  statusPill: {
    backgroundColor: COLORS.secondaryBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeStatusPill: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.hoverLime,
  },
  statusPillText: {
    fontSize: 11,
    color: COLORS.secondaryText,
    fontWeight: '500',
  },
  activeStatusPillText: {
    color: COLORS.primaryText,
    fontWeight: 'bold',
  },
  tableScroll: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tokenPill: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.hoverLime,
    marginRight: 6,
  },
  tokenPillText: {
    color: COLORS.primaryText,
    fontSize: 10,
    fontWeight: 'bold',
  },
  ticketId: {
    fontSize: 11,
    color: COLORS.secondaryText,
    fontWeight: 'bold',
    marginRight: 6,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  equipmentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primaryText,
    marginTop: 2,
  },
  locSub: {
    fontSize: 11,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  colLabel: {
    fontSize: 10,
    color: COLORS.secondaryText,
    fontWeight: '600',
  },
  colValue: {
    fontSize: 12,
    color: COLORS.primaryText,
    marginTop: 2,
  },
  timeSub: {
    fontSize: 10,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  techVal: {
    fontSize: 12,
    color: COLORS.primaryText,
    fontWeight: 'bold',
    marginTop: 2,
  },
  assignBtn: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 2,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.hoverLime,
  },
  assignBtnText: {
    color: COLORS.primaryText,
    fontSize: 11,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inspectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.hoverLime,
  },
  inspectBtnText: {
    color: COLORS.primaryText,
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 3,
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
  techOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  techName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primaryText,
  },
  techSpec: {
    fontSize: 11,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  closeModalBtn: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 8,
  },
});
