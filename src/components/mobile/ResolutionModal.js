import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme/colors';

export const ResolutionModal = ({ complaint, visible, onClose }) => {
  const { confirmResolution } = useApp();
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');

  if (!complaint) return null;

  const handleConfirmFixed = () => {
    confirmResolution(complaint.id, true, rating, feedback);
    onClose();
  };

  const handleReopen = () => {
    confirmResolution(complaint.id, false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Confirm Resolution</Text>
          <Text style={styles.subTitle}>
            Has the maintenance issue for ticket {complaint.id} ({complaint.equipment}) been resolved to your satisfaction?
          </Text>

          {/* Star Rating */}
          <Text style={styles.sectionLabel}>Rate Technician Service</Text>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={32}
                  color={star <= rating ? '#F59E0B' : COLORS.secondaryText}
                  style={{ marginHorizontal: 4 }}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Feedback Input */}
          <Text style={styles.sectionLabel}>Optional Feedback</Text>
          <TextInput
            style={styles.input}
            placeholder="Share details about technician response..."
            placeholderTextColor={COLORS.secondaryText}
            value={feedback}
            onChangeText={setFeedback}
            multiline
            numberOfLines={3}
          />

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.reopenBtn} onPress={handleReopen}>
              <Text style={styles.reopenText}>Not Fixed (Reopen)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmFixed}>
              <Ionicons name="checkmark-circle-outline" size={18} color={COLORS.primaryText} style={{ marginRight: 4 }} />
              <Text style={styles.confirmText}>Confirm & Close</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={{ color: COLORS.secondaryText, fontSize: 12 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    backgroundColor: COLORS.primaryBg,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryText,
    marginBottom: 6,
  },
  subTitle: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginBottom: 16,
    lineHeight: 18,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primaryText,
    marginBottom: 8,
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  input: {
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 10,
    padding: 12,
    color: COLORS.primaryText,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
    textAlignVertical: 'top',
    height: 70,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  reopenBtn: {
    flex: 1,
    backgroundColor: COLORS.dangerBg,
    borderWidth: 1,
    borderColor: COLORS.danger,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 6,
  },
  reopenText: {
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: 'bold',
  },
  confirmBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
    borderWidth: 1,
    borderColor: COLORS.hoverLime,
  },
  confirmText: {
    color: COLORS.primaryText,
    fontSize: 12,
    fontWeight: 'bold',
  },
  closeBtn: {
    alignItems: 'center',
    paddingVertical: 6,
  },
});
