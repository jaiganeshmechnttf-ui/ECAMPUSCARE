import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme/colors';

export const TicketDetailModal = ({ ticket, visible, onClose, onAssignClick }) => {
  const { updateComplaintStatus, deleteComplaint } = useApp();

  if (!ticket) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
              <View style={styles.tokenPill}>
                <Ionicons name="ticket-outline" size={14} color={COLORS.primaryText} style={{ marginRight: 4 }} />
                <Text style={styles.tokenPillText}>Token #{ticket.tokenNo || ticket.id}</Text>
              </View>
              <Text style={styles.ticketId}>{ticket.id}</Text>
              <View style={[
                styles.priorityBadge,
                ticket.priority === 'Critical' && { backgroundColor: COLORS.priorityCritical },
                ticket.priority === 'High' && { backgroundColor: COLORS.priorityHigh },
                ticket.priority === 'Medium' && { backgroundColor: COLORS.priorityMedium },
                ticket.priority === 'Low' && { backgroundColor: COLORS.priorityLow },
              ]}>
                <Text style={[
                  styles.priorityText,
                  ticket.priority === 'Critical' && { color: COLORS.priorityCriticalText },
                  ticket.priority === 'High' && { color: COLORS.priorityHighText },
                  ticket.priority === 'Medium' && { color: COLORS.priorityMediumText },
                  ticket.priority === 'Low' && { color: COLORS.priorityLowText },
                ]}>{ticket.priority}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeIconBtn}>
              <Ionicons name="close" size={22} color={COLORS.primaryText} />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ maxHeight: 520 }} contentContainerStyle={{ paddingVertical: 10 }}>
            {/* Title & Status Banner */}
            <View style={styles.titleBanner}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.equipmentTitle}>{ticket.equipment} - {ticket.problem}</Text>
                <Text style={styles.locationText}>📍 {ticket.building} · {ticket.room} ({ticket.floor || 'Floor N/A'})</Text>
              </View>
              <View style={[
                styles.statusBadge,
                ticket.status === 'Submitted' && { backgroundColor: COLORS.statusSubmitted },
                ticket.status === 'Assigned' && { backgroundColor: COLORS.statusAssigned },
                ticket.status === 'In Progress' && { backgroundColor: COLORS.statusInProgress },
                ticket.status === 'Resolved' && { backgroundColor: COLORS.statusResolved },
                ticket.status === 'Closed' && { backgroundColor: COLORS.statusClosed },
              ]}>
                <Text style={[
                  styles.statusText,
                  ticket.status === 'Submitted' && { color: COLORS.statusSubmittedText },
                  ticket.status === 'Assigned' && { color: COLORS.statusAssignedText },
                  ticket.status === 'In Progress' && { color: COLORS.statusInProgressText },
                  ticket.status === 'Resolved' && { color: COLORS.statusResolvedText },
                  ticket.status === 'Closed' && { color: COLORS.statusClosedText },
                ]}>{ticket.status}</Text>
              </View>
            </View>

            {/* Reporter Info Box */}
            <View style={styles.infoBox}>
              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={16} color={COLORS.secondaryText} style={{ marginRight: 6 }} />
                <Text style={styles.infoLabel}>Reported By:</Text>
                <Text style={styles.infoVal}>{ticket.reportedBy || 'Faculty Staff'} ({ticket.department || 'General'})</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={16} color={COLORS.secondaryText} style={{ marginRight: 6 }} />
                <Text style={styles.infoLabel}>Reported Time:</Text>
                <Text style={styles.infoVal}>{ticket.reportedTime || 'Recently'}</Text>
              </View>
            </View>

            {/* Full Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Full Incident Description</Text>
              <View style={styles.descBox}>
                <Text style={styles.descText}>{ticket.description || 'No additional description provided.'}</Text>
              </View>
            </View>

            {/* Photo Evidence */}
            {ticket.evidenceUrl ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Photo Evidence</Text>
                <Image source={{ uri: ticket.evidenceUrl }} style={styles.evidenceImg} resizeMode="cover" />
              </View>
            ) : null}

            {/* Technician Info & Work Notes */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Technician Assignment & Work Notes</Text>
              <View style={styles.techBox}>
                {ticket.assignedTech ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Ionicons name="construct-outline" size={16} color={COLORS.primaryText} style={{ marginRight: 6 }} />
                    <Text style={styles.techNameText}>Assigned Technician: <Text style={{ fontWeight: 'bold' }}>{ticket.assignedTech}</Text></Text>
                  </View>
                ) : (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={{ color: COLORS.secondaryText, fontSize: 13 }}>No technician assigned yet.</Text>
                    {onAssignClick ? (
                      <TouchableOpacity style={styles.assignActionBtn} onPress={() => { onClose(); onAssignClick(ticket); }}>
                        <Text style={styles.assignActionText}>+ Assign Now</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                )}

                {ticket.workNotes ? (
                  <View style={{ marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderTopColor: COLORS.border }}>
                    <Text style={{ fontSize: 11, color: COLORS.secondaryText, fontWeight: 'bold' }}>Latest Work Notes:</Text>
                    <Text style={{ fontSize: 12, color: COLORS.primaryText, marginTop: 2 }}>{ticket.workNotes}</Text>
                  </View>
                ) : null}
              </View>
            </View>

            {/* Feedback & Star Rating */}
            {(ticket.rating || ticket.feedback) ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Faculty Rating & Feedback</Text>
                <View style={styles.ratingBox}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons
                        key={star}
                        name={star <= (ticket.rating || 5) ? 'star' : 'star-outline'}
                        size={18}
                        color="#F59E0B"
                        style={{ marginRight: 2 }}
                      />
                    ))}
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: COLORS.primaryText, marginLeft: 6 }}>
                      {ticket.rating}/5 Stars
                    </Text>
                  </View>
                  {ticket.feedback ? (
                    <Text style={{ fontSize: 12, color: COLORS.secondaryText, fontStyle: 'italic' }}>"{ticket.feedback}"</Text>
                  ) : null}
                </View>
              </View>
            ) : null}

            {/* Step-by-Step Progress Timeline */}
            {ticket.timeline && ticket.timeline.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Live Audit Timeline</Text>
                {ticket.timeline.map((step, idx) => (
                  <View key={idx} style={styles.timelineRow}>
                    <View style={styles.timelineDot} />
                    <View style={styles.timelineContent}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                        <Text style={styles.timelineStepTitle}>{step.title}</Text>
                        <Text style={styles.timelineStepTime}>{step.time}</Text>
                      </View>
                      <Text style={styles.timelineStepDesc}>{step.desc}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : null}
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footerRow}>
            {ticket.status !== 'Closed' && ticket.status !== 'Resolved' && (
              <TouchableOpacity
                style={styles.actionProgressBtn}
                onPress={() => updateComplaintStatus(ticket.id, 'In Progress', 'Technician on-site inspecting equipment')}
              >
                <Text style={styles.actionProgressText}>In Progress</Text>
              </TouchableOpacity>
            )}

            {ticket.status !== 'Closed' && ticket.status !== 'Resolved' && (
              <TouchableOpacity
                style={styles.actionResolveBtn}
                onPress={() => updateComplaintStatus(ticket.id, 'Resolved', 'Technician completed repairs successfully')}
              >
                <Text style={styles.actionResolveText}>Mark Resolved</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.actionDeleteBtn} onPress={() => { deleteComplaint(ticket.id); onClose(); }}>
              <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 620,
    backgroundColor: COLORS.primaryBg,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 10,
  },
  tokenPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.hoverLime,
    marginRight: 8,
  },
  tokenPillText: {
    color: COLORS.primaryText,
    fontSize: 11,
    fontWeight: 'bold',
  },
  ticketId: {
    fontSize: 12,
    color: COLORS.secondaryText,
    fontWeight: 'bold',
    marginRight: 8,
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
  closeIconBtn: {
    padding: 4,
  },
  titleBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  equipmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryText,
  },
  locationText: {
    fontSize: 12,
    color: COLORS.primaryText,
    marginTop: 4,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.secondaryText,
    width: 100,
    fontWeight: '600',
  },
  infoVal: {
    fontSize: 12,
    color: COLORS.primaryText,
    fontWeight: 'bold',
    flex: 1,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primaryText,
    marginBottom: 6,
  },
  descBox: {
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  descText: {
    fontSize: 13,
    color: COLORS.primaryText,
    lineHeight: 18,
  },
  evidenceImg: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  techBox: {
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  techNameText: {
    fontSize: 13,
    color: COLORS.primaryText,
  },
  assignActionBtn: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.hoverLime,
  },
  assignActionText: {
    color: COLORS.primaryText,
    fontSize: 11,
    fontWeight: 'bold',
  },
  ratingBox: {
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
    marginTop: 5,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.hoverLime,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timelineStepTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primaryText,
  },
  timelineStepTime: {
    fontSize: 10,
    color: COLORS.secondaryText,
  },
  timelineStepDesc: {
    fontSize: 11,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 6,
  },
  actionProgressBtn: {
    backgroundColor: COLORS.statusAssigned,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 6,
  },
  actionProgressText: {
    color: COLORS.statusAssignedText,
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionResolveBtn: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 6,
    borderWidth: 1,
    borderColor: COLORS.hoverLime,
  },
  actionResolveText: {
    color: COLORS.primaryText,
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionDeleteBtn: {
    padding: 8,
    marginRight: 6,
  },
  closeBtn: {
    backgroundColor: COLORS.secondaryBg,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  closeBtnText: {
    color: COLORS.primaryText,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
