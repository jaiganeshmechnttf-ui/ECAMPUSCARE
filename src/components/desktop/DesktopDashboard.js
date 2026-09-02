import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme/colors';
import { TicketDetailModal } from './TicketDetailModal';

export const DesktopDashboard = () => {
  const { complaints, technicians, buildings, runLiveDemo, isDemoRunning, setDesktopTab } = useApp();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filterIncompleteOnly, setFilterIncompleteOnly] = useState(false);

  const totalCount = complaints.length;
  const incompleteCount = complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length;
  const criticalCount = complaints.filter(c => c.priority === 'Critical' && c.status !== 'Closed').length;
  const activeTechs = technicians.filter(t => t.status === 'Available' || t.status === 'Busy').length;
  const resolvedToday = complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;

  const displayedComplaints = filterIncompleteOnly
    ? complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Closed')
    : complaints;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Facility Operations Control Center</Text>
          <Text style={styles.subTitle}>Real-time campus maintenance monitoring & technician dispatch</Text>
        </View>
        <TouchableOpacity
          style={[styles.demoBtn, isDemoRunning && { opacity: 0.6 }]}
          onPress={runLiveDemo}
          disabled={isDemoRunning}
          activeOpacity={0.85}
        >
          <Ionicons name="play-circle-outline" size={18} color={COLORS.primaryText} style={{ marginRight: 6 }} />
          <Text style={styles.demoBtnText}>{isDemoRunning ? 'Running Demo...' : 'Run 30s Live Demo'}</Text>
        </TouchableOpacity>
      </View>

      {/* KPI Cards */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiVal}>{totalCount}</Text>
          <Text style={styles.kpiLabel}>Total Tickets</Text>
        </View>

        <TouchableOpacity
          style={[styles.kpiCard, filterIncompleteOnly && { borderColor: COLORS.warning, borderWidth: 2 }]}
          onPress={() => setFilterIncompleteOnly(!filterIncompleteOnly)}
          activeOpacity={0.8}
        >
          <Text style={[styles.kpiVal, { color: COLORS.warning }]}>{incompleteCount}</Text>
          <Text style={styles.kpiLabel}>⚠️ Incomplete Reports</Text>
        </TouchableOpacity>

        <View style={styles.kpiCard}>
          <Text style={[styles.kpiVal, { color: COLORS.danger }]}>{criticalCount}</Text>
          <Text style={styles.kpiLabel}>Critical SLA</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={[styles.kpiVal, { color: COLORS.primaryText }]}>{activeTechs}</Text>
          <Text style={styles.kpiLabel}>Active Technicians</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={[styles.kpiVal, { color: COLORS.success }]}>{resolvedToday}</Text>
          <Text style={styles.kpiLabel}>Resolved Today</Text>
        </View>
      </View>

      {/* Main Content Grid */}
      <View style={styles.gridRow}>
        {/* Left Column: Live Dispatch Feed */}
        <View style={styles.leftCol}>
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.cardTitle}>Live Incident Dispatch Feed</Text>
              <TouchableOpacity
                style={[styles.filterToggleBtn, filterIncompleteOnly && styles.activeFilterToggle]}
                onPress={() => setFilterIncompleteOnly(!filterIncompleteOnly)}
              >
                <Ionicons
                  name={filterIncompleteOnly ? "warning" : "list-outline"}
                  size={12}
                  color={filterIncompleteOnly ? COLORS.warningText : COLORS.primaryText}
                  style={{ marginRight: 4 }}
                />
                <Text style={[styles.filterToggleText, filterIncompleteOnly && styles.activeFilterToggleText]}>
                  {filterIncompleteOnly ? `Incomplete Only (${incompleteCount})` : 'Show Incomplete'}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setDesktopTab('table')}>
              <Text style={styles.viewAll}>View Full Table</Text>
            </TouchableOpacity>
          </View>

          {displayedComplaints.length === 0 ? (
            <View style={styles.emptyFeedBox}>
              <Ionicons name="checkmark-circle-outline" size={32} color={COLORS.success} />
              <Text style={styles.emptyFeedText}>No incomplete reports! All maintenance tickets are resolved.</Text>
            </View>
          ) : (
            displayedComplaints.slice(0, 6).map((item) => {
              const isIncomplete = item.status !== 'Resolved' && item.status !== 'Closed';
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.feedItem, isIncomplete && { borderLeftWidth: 4, borderLeftColor: COLORS.warning }]}
                  onPress={() => setSelectedTicket(item)}
                  activeOpacity={0.75}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                      <View style={styles.tokenPill}>
                        <Text style={styles.tokenPillText}>Token #{item.tokenNo || item.id}</Text>
                      </View>
                      <Text style={styles.feedId}>{item.id}</Text>
                      <View style={[
                        styles.badge,
                        item.priority === 'Critical' && { backgroundColor: COLORS.priorityCritical },
                        item.priority === 'High' && { backgroundColor: COLORS.priorityHigh },
                        item.priority === 'Medium' && { backgroundColor: COLORS.priorityMedium },
                        item.priority === 'Low' && { backgroundColor: COLORS.priorityLow },
                      ]}>
                        <Text style={[
                          styles.badgeText,
                          item.priority === 'Critical' && { color: COLORS.priorityCriticalText },
                          item.priority === 'High' && { color: COLORS.priorityHighText },
                          item.priority === 'Medium' && { color: COLORS.priorityMediumText },
                          item.priority === 'Low' && { color: COLORS.priorityLowText },
                        ]}>{item.priority}</Text>
                      </View>

                      {isIncomplete && (
                        <View style={styles.incompleteTag}>
                          <Text style={styles.incompleteTagText}>INCOMPLETE</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.feedTitle}>{item.equipment} - {item.problem}</Text>
                    <Text style={styles.feedLoc}>{item.building} · {item.room}</Text>
                  </View>

                  <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                    <Text style={styles.feedTime}>{item.reportedTime}</Text>
                    <Text style={[styles.statusText, isIncomplete && { color: COLORS.warning, fontWeight: 'bold' }]}>{item.status}</Text>
                    <Text style={styles.clickPrompt}>Click to Read Full Details →</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Right Column: Building Health */}
        <View style={styles.rightCol}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Building Health Status</Text>
            <TouchableOpacity onPress={() => setDesktopTab('map')}>
              <Text style={styles.viewAll}>Interactive Map</Text>
            </TouchableOpacity>
          </View>

          {buildings.map((bld) => (
            <View key={bld.id} style={styles.bldItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.bldName}>{bld.code} - {bld.name}</Text>
                <Text style={styles.bldSub}>{bld.floors} Floors · {bld.rooms} Rooms</Text>
              </View>
              <View style={[
                styles.bldBadge,
                bld.activeIssues > 3 ? { backgroundColor: COLORS.dangerBg } : { backgroundColor: COLORS.successBg }
              ]}>
                <Text style={[
                  styles.bldBadgeText,
                  bld.activeIssues > 3 ? { color: COLORS.danger } : { color: COLORS.success }
                ]}>
                  {bld.activeIssues} Issues
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Ticket Full Inspection Modal */}
      <TicketDetailModal
        ticket={selectedTicket}
        visible={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />
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
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primaryText,
  },
  subTitle: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  demoBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.hoverLime,
  },
  demoBtnText: {
    color: COLORS.primaryText,
    fontSize: 13,
    fontWeight: 'bold',
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  kpiVal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primaryText,
  },
  kpiLabel: {
    fontSize: 11,
    color: COLORS.secondaryText,
    marginTop: 4,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftCol: {
    flex: 1.4,
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 14,
    padding: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rightCol: {
    flex: 1,
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 14,
    padding: 16,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primaryText,
    marginRight: 10,
  },
  filterToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeFilterToggle: {
    backgroundColor: COLORS.warningBg,
    borderColor: COLORS.warning,
  },
  filterToggleText: {
    fontSize: 10,
    color: COLORS.primaryText,
    fontWeight: '600',
  },
  activeFilterToggleText: {
    color: COLORS.warningText,
    fontWeight: 'bold',
  },
  incompleteTag: {
    backgroundColor: COLORS.warningBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
    borderWidth: 1,
    borderColor: COLORS.warning,
  },
  incompleteTagText: {
    color: COLORS.warningText,
    fontSize: 9,
    fontWeight: 'bold',
  },
  emptyFeedBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: COLORS.primaryBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyFeedText: {
    color: COLORS.secondaryText,
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  viewAll: {
    fontSize: 12,
    color: COLORS.primaryText,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  feedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primaryBg,
    borderRadius: 10,
    padding: 12,
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
  feedId: {
    fontSize: 11,
    color: COLORS.secondaryText,
    fontWeight: 'bold',
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: COLORS.secondaryBg,
  },
  badgeText: {
    fontSize: 10,
    color: COLORS.primaryText,
    fontWeight: 'bold',
  },
  feedTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primaryText,
    marginTop: 2,
  },
  feedLoc: {
    fontSize: 11,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  feedTime: {
    fontSize: 10,
    color: COLORS.secondaryText,
  },
  statusText: {
    fontSize: 11,
    color: COLORS.primaryText,
    fontWeight: '600',
    marginTop: 2,
  },
  clickPrompt: {
    fontSize: 10,
    color: COLORS.secondaryText,
    fontWeight: '600',
    marginTop: 4,
    textDecorationLine: 'underline',
  },
  bldItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primaryBg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bldName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primaryText,
  },
  bldSub: {
    fontSize: 11,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  bldBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bldBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});
