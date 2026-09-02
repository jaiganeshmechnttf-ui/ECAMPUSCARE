import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme/colors';
import { TicketDetailModal } from './TicketDetailModal';

export const AdminView = () => {
  const {
    complaints,
    technicians,
    assignTechnician,
    updateComplaintStatus,
    deleteComplaint,
    knowledgeBase,
    clearAllHistory,
    showToast,
    isSseConnected,
  } = useApp();

  const [assignModalTicket, setAssignModalTicket] = useState(null);
  const [selectedDetailTicket, setSelectedDetailTicket] = useState(null);

  const handleAssignTech = (techName) => {
    if (assignModalTicket) {
      assignTechnician(assignModalTicket.id, techName);
      setAssignModalTicket(null);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      {/* Header with Real-Time SSE Indicator */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>System Admin & Real-Time Token Dispatch Monitor</Text>
          <Text style={styles.subTitle}>Live ticket tokens, automated dispatch rules, and system database controls</Text>
        </View>

        {/* Live SSE Status Badge */}
        <View style={[
          styles.sseBadge,
          isSseConnected ? { backgroundColor: COLORS.statusResolved, borderColor: COLORS.success } : { backgroundColor: COLORS.statusAssigned, borderColor: COLORS.warning }
        ]}>
          <View style={[
            styles.pulseDot,
            isSseConnected ? { backgroundColor: COLORS.success } : { backgroundColor: COLORS.warning }
          ]} />
          <Text style={[
            styles.sseBadgeText,
            isSseConnected ? { color: COLORS.statusResolvedText } : { color: COLORS.statusAssignedText }
          ]}>
            {isSseConnected ? 'LIVE Real-Time Sync Active' : 'Connecting Real-time Sync...'}
          </Text>
        </View>
      </View>

      {/* Real-Time Token Monitor Card */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="radio-outline" size={20} color={COLORS.primaryText} style={{ marginRight: 8 }} />
              <Text style={styles.sectionTitle}>Real-Time Token Monitor ({complaints.length} Tickets)</Text>
            </View>
            <View style={{ backgroundColor: COLORS.warningBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: COLORS.warning }}>
              <Text style={{ color: COLORS.warningText, fontSize: 11, fontWeight: 'bold' }}>
                ⚠️ {complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length} Incomplete Reports
              </Text>
            </View>
          </View>
          <Text style={styles.tokenSubHeader}>Click any token card to inspect full details, timeline & photo evidence</Text>
        </View>

        {complaints.length === 0 ? (
          <View style={styles.emptyTokenBox}>
            <Ionicons name="sparkles-outline" size={32} color={COLORS.secondaryText} />
            <Text style={styles.emptyTokenText}>No active tokens reported yet. Submit a problem from the Mobile App to test real-time sync!</Text>
          </View>
        ) : (
          complaints.slice(0, 6).map((item) => {
            const tokenDisplay = item.tokenNo || item.id;
            const isIncomplete = item.status !== 'Resolved' && item.status !== 'Closed';
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.tokenCard, isIncomplete && { borderLeftWidth: 4, borderLeftColor: COLORS.warning }]}
                onPress={() => setSelectedDetailTicket(item)}
                activeOpacity={0.8}
              >
                <View style={styles.tokenCardHeader}>
                  <View style={styles.tokenPill}>
                    <Ionicons name="ticket-outline" size={14} color={COLORS.primaryText} style={{ marginRight: 4 }} />
                    <Text style={styles.tokenPillText}>Token #{tokenDisplay}</Text>
                  </View>

                  <Text style={styles.sysTicketId}>{item.id}</Text>

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

                  {isIncomplete && (
                    <View style={{ backgroundColor: COLORS.warningBg, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginLeft: 6, borderWidth: 1, borderColor: COLORS.warning }}>
                      <Text style={{ color: COLORS.warningText, fontSize: 9, fontWeight: 'bold' }}>PENDING RESOLUTION</Text>
                    </View>
                  )}
                </View>

                {/* Token Details */}
                <View style={styles.tokenBody}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.tokenEquip}>{item.equipment} - {item.problem}</Text>
                    <Text style={styles.tokenLocation}>📍 {item.building} · {item.room} ({item.floor})</Text>
                    <Text style={styles.tokenReporter}>👤 Reported by: {item.reportedBy} ({item.department || 'Faculty'}) · {item.reportedTime}</Text>
                  </View>

                  {/* Status & Quick Admin Actions */}
                  <View style={styles.tokenActionCol}>
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

                    {item.assignedTech ? (
                      <Text style={styles.assignedTechText}>🔧 {item.assignedTech}</Text>
                    ) : (
                      <TouchableOpacity style={styles.quickAssignBtn} onPress={(e) => { e.stopPropagation(); setAssignModalTicket(item); }}>
                        <Text style={styles.quickAssignText}>+ Assign Tech</Text>
                      </TouchableOpacity>
                    )}

                    <View style={styles.adminRowBtns}>
                      <TouchableOpacity
                        style={styles.adminInspectBtn}
                        onPress={(e) => { e.stopPropagation(); setSelectedDetailTicket(item); }}
                      >
                        <Ionicons name="eye-outline" size={12} color={COLORS.primaryText} />
                        <Text style={styles.adminInspectText}>Read</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={{ marginLeft: 6 }} onPress={(e) => { e.stopPropagation(); deleteComplaint(item.id); }}>
                        <Ionicons name="trash-outline" size={14} color={COLORS.danger} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>

      {/* AI Knowledge Base Rules */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>AI Knowledge Base & Troubleshooting Rules</Text>
        {knowledgeBase.map((kb) => (
          <View key={kb.id} style={styles.kbItem}>
            <View style={styles.kbHeader}>
              <Text style={styles.kbEquip}>{kb.equipment} - {kb.problem}</Text>
            </View>
            <Text style={styles.kbStep}><Text style={{ fontWeight: 'bold' }}>Troubleshooting: </Text>{kb.troubleshootingStep}</Text>
            <Text style={styles.kbEscalation}><Text style={{ fontWeight: 'bold' }}>Escalation Trigger: </Text>{kb.escalationTrigger}</Text>
          </View>
        ))}
      </View>

      {/* System Maintenance Actions */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Database & System Actions</Text>

        <TouchableOpacity style={styles.actionBtn} onPress={() => showToast('Exported system audit report PDF!', 'info')}>
          <Ionicons name="download-outline" size={18} color={COLORS.primaryText} />
          <Text style={styles.actionBtnText}>Export System Incident & Token Audit Log (PDF/CSV)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, { borderColor: COLORS.danger }]} onPress={clearAllHistory}>
          <Ionicons name="trash-bin-outline" size={18} color={COLORS.danger} />
          <Text style={[styles.actionBtnText, { color: COLORS.danger }]}>Clear All Complaint History</Text>
        </TouchableOpacity>
      </View>

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
            <Text style={styles.modalTitle}>Dispatch Technician for Token #{assignModalTicket?.tokenNo || assignModalTicket?.id}</Text>
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
  sseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  sseBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  sectionCard: {
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionHeaderRow: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryText,
  },
  tokenSubHeader: {
    fontSize: 11,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  emptyTokenBox: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.primaryBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyTokenText: {
    color: COLORS.secondaryText,
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  tokenCard: {
    backgroundColor: COLORS.primaryBg,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tokenCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tokenPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.hoverLime,
    marginRight: 8,
  },
  tokenPillText: {
    color: COLORS.primaryText,
    fontSize: 12,
    fontWeight: 'bold',
  },
  sysTicketId: {
    fontSize: 11,
    color: COLORS.secondaryText,
    fontWeight: 'bold',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  tokenBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tokenEquip: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primaryText,
  },
  tokenLocation: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginTop: 3,
    fontWeight: '600',
  },
  tokenReporter: {
    fontSize: 11,
    color: COLORS.secondaryText,
    marginTop: 3,
  },
  tokenActionCol: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  assignedTechText: {
    fontSize: 11,
    color: COLORS.primaryText,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quickAssignBtn: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: COLORS.hoverLime,
  },
  quickAssignText: {
    color: COLORS.primaryText,
    fontSize: 10,
    fontWeight: 'bold',
  },
  adminRowBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  adminInspectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginLeft: 4,
    borderWidth: 1,
    borderColor: COLORS.hoverLime,
  },
  adminInspectText: {
    color: COLORS.primaryText,
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  kbItem: {
    backgroundColor: COLORS.primaryBg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  kbHeader: {
    marginBottom: 4,
  },
  kbEquip: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primaryText,
  },
  kbStep: {
    fontSize: 11,
    color: COLORS.primaryText,
    marginTop: 4,
    lineHeight: 16,
  },
  kbEscalation: {
    fontSize: 11,
    color: COLORS.secondaryText,
    marginTop: 4,
    lineHeight: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryBg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionBtnText: {
    fontSize: 13,
    color: COLORS.primaryText,
    fontWeight: '600',
    marginLeft: 10,
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
