import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { ResolutionModal } from './ResolutionModal';
import { COLORS } from '../../theme/colors';

export const ComplaintTracking = () => {
  const { complaints, deleteComplaint } = useApp();
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'resolved'
  const [expandedTicketId, setExpandedTicketId] = useState(null);
  const [selectedResolutionTicket, setSelectedResolutionTicket] = useState(null);

  const filteredComplaints = complaints.filter(item => {
    if (filter === 'active') return item.status !== 'Closed' && item.status !== 'Resolved';
    if (filter === 'resolved') return item.status === 'Closed' || item.status === 'Resolved';
    return true;
  });

  const toggleExpand = (id) => {
    setExpandedTicketId(expandedTicketId === id ? null : id);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Incident Tracking</Text>
        <Text style={styles.subTitle}>Live timeline status & resolution history</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, filter === 'all' && styles.activeTabBtn]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.tabText, filter === 'all' && styles.activeTabText]}>All ({complaints.length})</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, filter === 'active' && styles.activeTabBtn]}
          onPress={() => setFilter('active')}
        >
          <Text style={[styles.tabText, filter === 'active' && styles.activeTabText]}>
            Active ({complaints.filter(c => c.status !== 'Closed' && c.status !== 'Resolved').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, filter === 'resolved' && styles.activeTabBtn]}
          onPress={() => setFilter('resolved')}
        >
          <Text style={[styles.tabText, filter === 'resolved' && styles.activeTabText]}>
            Resolved ({complaints.filter(c => c.status === 'Closed' || c.status === 'Resolved').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Ticket Stream */}
      {filteredComplaints.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="document-text-outline" size={48} color={COLORS.secondaryText} />
          <Text style={styles.emptyText}>No incident tickets match this filter.</Text>
        </View>
      ) : (
        filteredComplaints.map((item) => {
          const isExpanded = expandedTicketId === item.id;
          return (
            <View key={item.id} style={styles.card}>
              <TouchableOpacity onPress={() => toggleExpand(item.id)} activeOpacity={0.8}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                      <View style={styles.tokenPill}>
                        <Text style={styles.tokenPillText}>Token #{item.tokenNo || item.id}</Text>
                      </View>
                      <Text style={styles.ticketId}>{item.id}</Text>
                    </View>
                    <Text style={styles.equipmentTitle}>{item.equipment} - {item.problem}</Text>
                    <Text style={styles.locationText}>{item.building} · {item.room}</Text>
                  </View>
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
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.timeText}>{item.reportedTime}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: COLORS.primaryText, fontSize: 11, fontWeight: 'bold', marginRight: 4 }}>
                      {isExpanded ? 'Hide Details' : 'View Timeline'}
                    </Text>
                    <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.primaryText} />
                  </View>
                </View>
              </TouchableOpacity>

              {/* Expanded Timeline Details */}
              {isExpanded && (
                <View style={styles.expandedSection}>
                  <Text style={styles.detailLabel}>Description:</Text>
                  <Text style={styles.detailValue}>{item.description}</Text>

                  {item.assignedTech ? (
                    <View style={styles.techInfo}>
                      <Ionicons name="person-circle-outline" size={18} color={COLORS.primaryText} />
                      <Text style={styles.techInfoText}>Assigned Technician: {item.assignedTech}</Text>
                    </View>
                  ) : null}

                  {item.evidenceUrl ? (
                    <View style={{ marginTop: 8, marginBottom: 12 }}>
                      <Text style={styles.detailLabel}>Photo Evidence:</Text>
                      <Image source={{ uri: item.evidenceUrl }} style={styles.evidenceImage} />
                    </View>
                  ) : null}

                  {/* Step-by-Step Timeline */}
                  <Text style={[styles.detailLabel, { marginTop: 10, marginBottom: 8 }]}>Progress Timeline:</Text>
                  {item.timeline && item.timeline.map((step, idx) => (
                    <View key={idx} style={styles.timelineItem}>
                      <View style={styles.timelineDot} />
                      <View style={styles.timelineContent}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text style={styles.timelineTitle}>{step.title}</Text>
                          <Text style={styles.timelineTime}>{step.time}</Text>
                        </View>
                        <Text style={styles.timelineDesc}>{step.desc}</Text>
                      </View>
                    </View>
                  ))}

                  {/* Resolution Action */}
                  {item.status === 'Resolved' && (
                    <TouchableOpacity
                      style={styles.resolveConfirmBtn}
                      onPress={() => setSelectedResolutionTicket(item)}
                    >
                      <Ionicons name="star" size={16} color={COLORS.primaryText} style={{ marginRight: 6 }} />
                      <Text style={styles.resolveConfirmText}>Confirm Fix & Rate Service</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteComplaint(item.id)}>
                    <Ionicons name="trash-outline" size={14} color={COLORS.danger} style={{ marginRight: 4 }} />
                    <Text style={styles.deleteText}>Delete Ticket</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })
      )}

      {/* Resolution Confirmation Modal */}
      <ResolutionModal
        complaint={selectedResolutionTicket}
        visible={!!selectedResolutionTicket}
        onClose={() => setSelectedResolutionTicket(null)}
      />
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
    marginBottom: 16,
    paddingTop: 8,
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
  tabRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabBtn: {
    backgroundColor: COLORS.accent,
  },
  tabText: {
    fontSize: 11,
    color: COLORS.secondaryText,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.primaryText,
    fontWeight: 'bold',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    color: COLORS.secondaryText,
    fontSize: 13,
    marginTop: 12,
  },
  card: {
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  },
  equipmentTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primaryText,
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  timeText: {
    fontSize: 11,
    color: COLORS.secondaryText,
  },
  expandedSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  detailLabel: {
    fontSize: 11,
    color: COLORS.secondaryText,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 13,
    color: COLORS.primaryText,
    marginTop: 2,
    marginBottom: 8,
    lineHeight: 18,
  },
  techInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryBg,
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  techInfoText: {
    fontSize: 12,
    color: COLORS.primaryText,
    fontWeight: '600',
    marginLeft: 6,
  },
  evidenceImage: {
    width: '100%',
    height: 140,
    borderRadius: 10,
    marginTop: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primaryText,
    marginTop: 4,
    marginRight: 10,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: COLORS.primaryBg,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timelineTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primaryText,
  },
  timelineTime: {
    fontSize: 10,
    color: COLORS.secondaryText,
  },
  timelineDesc: {
    fontSize: 11,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  resolveConfirmBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.hoverLime,
  },
  resolveConfirmText: {
    color: COLORS.primaryText,
    fontSize: 13,
    fontWeight: 'bold',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 6,
  },
  deleteText: {
    color: COLORS.danger,
    fontSize: 11,
  },
});
