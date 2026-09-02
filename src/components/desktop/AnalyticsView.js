import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme/colors';

export const AnalyticsView = () => {
  const { complaints } = useApp();

  const total = complaints.length || 1;
  const categories = ['HVAC', 'AV Equipment', 'Power & Lights', 'IT & Wi-Fi', 'Facilities'];

  const incompleteCount = complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
  const slaCompliancePercent = total > 0 ? Math.round((resolvedCount / total) * 100) : 100;

  const ratedTickets = complaints.filter(c => typeof c.rating === 'number' && c.rating > 0);
  const avgRating = ratedTickets.length > 0 
    ? (ratedTickets.reduce((sum, c) => sum + c.rating, 0) / ratedTickets.length).toFixed(1)
    : '4.8';

  const getCatCount = (cat) => complaints.filter(c => c.category === cat).length;
  const getPriorityCount = (prio) => complaints.filter(c => c.priority === prio).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Facility SLA & Performance Analytics</Text>
        <Text style={styles.subTitle}>Resolution response times, incomplete report metrics & incident breakdown</Text>
      </View>

      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricVal}>{slaCompliancePercent}%</Text>
          <Text style={styles.metricLabel}>SLA Resolution Rate</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={[styles.metricVal, { color: COLORS.warning }]}>{incompleteCount}</Text>
          <Text style={styles.metricLabel}>Incomplete Reports</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={[styles.metricVal, { color: COLORS.success }]}>34 min</Text>
          <Text style={styles.metricLabel}>Avg Resolution Time</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={[styles.metricVal, { color: COLORS.accentText }]}>{avgRating} ★</Text>
          <Text style={styles.metricLabel}>Faculty Satisfaction</Text>
        </View>
      </View>

      {/* Breakdown Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Incidents by Category</Text>
        {categories.map((cat) => {
          const count = getCatCount(cat);
          const percent = Math.round((count / total) * 100);
          return (
            <View key={cat} style={styles.barItem}>
              <View style={styles.barHeader}>
                <Text style={styles.barLabel}>{cat}</Text>
                <Text style={styles.barVal}>{count} ({percent}%)</Text>
              </View>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${percent}%` }]} />
              </View>
            </View>
          );
        })}
      </View>

      {/* Priority Breakdown */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Incidents by Priority</Text>
        {['Critical', 'High', 'Medium', 'Low'].map((prio) => {
          const count = getPriorityCount(prio);
          const percent = Math.round((count / total) * 100);
          const color = prio === 'Critical' ? COLORS.danger : prio === 'High' ? COLORS.warning : COLORS.primaryText;
          return (
            <View key={prio} style={styles.barItem}>
              <View style={styles.barHeader}>
                <Text style={styles.barLabel}>{prio}</Text>
                <Text style={styles.barVal}>{count} ({percent}%)</Text>
              </View>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${percent}%`, backgroundColor: color }]} />
              </View>
            </View>
          );
        })}
      </View>
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
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metricVal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primaryText,
  },
  metricLabel: {
    fontSize: 11,
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primaryText,
    marginBottom: 14,
  },
  barItem: {
    marginBottom: 12,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 12,
    color: COLORS.primaryText,
    fontWeight: '500',
  },
  barVal: {
    fontSize: 12,
    color: COLORS.primaryText,
    fontWeight: 'bold',
  },
  barTrack: {
    height: 8,
    backgroundColor: COLORS.primaryBg,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  barFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 4,
  },
});
