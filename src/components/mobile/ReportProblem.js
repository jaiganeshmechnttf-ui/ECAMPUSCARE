import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme/colors';

export const ReportProblem = () => {
  const { currentUser, createComplaint, setMobileTab, prefilledEquipment } = useApp();

  const [equipment, setEquipment] = useState(prefilledEquipment || 'AC');
  const [category, setCategory] = useState('HVAC');
  const [problem, setProblem] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('High');
  const [building, setBuilding] = useState(currentUser?.defaultBuilding || 'Block A');
  const [room, setRoom] = useState(currentUser?.defaultRoom || 'Room 302');
  const [floor, setFloor] = useState(currentUser?.defaultFloor || '3rd Floor');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (prefilledEquipment) {
      setEquipment(prefilledEquipment);
      if (prefilledEquipment === 'AC') setCategory('HVAC');
      else if (prefilledEquipment === 'TV' || prefilledEquipment === 'Projector') setCategory('AV Equipment');
      else if (prefilledEquipment === 'Electrical') setCategory('Power & Lights');
      else if (prefilledEquipment === 'Network') setCategory('IT & Wi-Fi');
      else setCategory('Facilities');
    }
  }, [prefilledEquipment]);

  const categories = ['HVAC', 'AV Equipment', 'Power & Lights', 'IT & Wi-Fi', 'Facilities'];
  const priorities = ['Low', 'Medium', 'High', 'Critical'];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, camera roll permissions are needed to select an image evidence.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      if (asset.base64) {
        setEvidenceUrl(`data:image/jpeg;base64,${asset.base64}`);
      } else {
        setEvidenceUrl(asset.uri);
      }
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permission is required to capture evidence.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      if (asset.base64) {
        setEvidenceUrl(`data:image/jpeg;base64,${asset.base64}`);
      } else {
        setEvidenceUrl(asset.uri);
      }
    }
  };

  const handleSubmit = async () => {
    if (!problem.trim()) {
      Alert.alert('Missing Field', 'Please enter a short summary of the problem.');
      return;
    }

    setIsSubmitting(true);
    await createComplaint({
      building,
      room,
      floor,
      equipment,
      category,
      problem,
      description,
      priority,
      evidenceUrl,
    });
    setIsSubmitting(false);
    setMobileTab('requests');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Title */}
      <View style={styles.header}>
        <Text style={styles.title}>Report Facility Issue</Text>
        <Text style={styles.subTitle}>Direct dispatch to maintenance team</Text>
      </View>

      {/* Auto Location Banner */}
      <View style={styles.locationBanner}>
        <Ionicons name="location" size={20} color={COLORS.primaryText} />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={styles.locationLabel}>Location (Auto-Attached)</Text>
          <Text style={styles.locationValue}>{building} · {room} · {floor}</Text>
        </View>
      </View>

      {/* Category Pills */}
      <Text style={styles.label}>Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.pill, category === cat && styles.activePill]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.pillText, category === cat && styles.activePillText]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Equipment Input */}
      <Text style={styles.label}>Equipment Name</Text>
      <TextInput
        style={styles.input}
        value={equipment}
        onChangeText={setEquipment}
        placeholder="e.g. AC, Projector, TV, Smartboard"
        placeholderTextColor={COLORS.secondaryText}
      />

      {/* Problem Summary */}
      <Text style={styles.label}>Short Problem Summary</Text>
      <TextInput
        style={styles.input}
        value={problem}
        onChangeText={setProblem}
        placeholder="e.g. AC not cooling / HDMI no signal"
        placeholderTextColor={COLORS.secondaryText}
      />

      {/* Detailed Description */}
      <Text style={styles.label}>Detailed Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        placeholder="Provide additional details about the malfunction..."
        placeholderTextColor={COLORS.secondaryText}
      />

      {/* Priority Selection */}
      <Text style={styles.label}>Priority Level</Text>
      <View style={styles.priorityRow}>
        {priorities.map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.priorityBtn, priority === p && styles.activePriorityBtn]}
            onPress={() => setPriority(p)}
          >
            <Text style={[styles.priorityText, priority === p && styles.activePriorityText]}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Photo Attachment Section */}
      <Text style={styles.label}>Evidence Attachment</Text>
      <View style={styles.photoContainer}>
        {evidenceUrl ? (
          <View style={styles.previewWrapper}>
            <Image source={{ uri: evidenceUrl }} style={styles.previewImage} />
            <TouchableOpacity style={styles.removePhoto} onPress={() => setEvidenceUrl('')}>
              <Ionicons name="close-circle" size={24} color={COLORS.danger} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.photoBtnRow}>
            <TouchableOpacity style={styles.photoBtn} onPress={takePhoto}>
              <Ionicons name="camera-outline" size={24} color={COLORS.primaryText} />
              <Text style={styles.photoBtnText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.photoBtn} onPress={pickImage}>
              <Ionicons name="image-outline" size={24} color={COLORS.primaryText} />
              <Text style={styles.photoBtnText}>Pick Gallery</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitBtn, isSubmitting && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={isSubmitting}
        activeOpacity={0.85}
      >
        <Ionicons name="paper-plane-outline" size={20} color={COLORS.primaryText} style={{ marginRight: 8 }} />
        <Text style={styles.submitText}>{isSubmitting ? 'Submitting Ticket...' : 'Submit Incident Ticket'}</Text>
      </TouchableOpacity>
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
  locationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  locationLabel: {
    fontSize: 10,
    color: COLORS.secondaryText,
    fontWeight: '600',
  },
  locationValue: {
    fontSize: 13,
    color: COLORS.primaryText,
    fontWeight: 'bold',
    marginTop: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primaryText,
    marginBottom: 8,
    marginTop: 12,
  },
  pillRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  pill: {
    backgroundColor: COLORS.secondaryBg,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activePill: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.hoverLime,
  },
  pillText: {
    color: COLORS.secondaryText,
    fontSize: 12,
    fontWeight: '500',
  },
  activePillText: {
    color: COLORS.primaryText,
    fontWeight: '700',
  },
  input: {
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 10,
    padding: 12,
    color: COLORS.primaryText,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 14,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  priorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityBtn: {
    flex: 1,
    backgroundColor: COLORS.secondaryBg,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activePriorityBtn: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.hoverLime,
  },
  priorityText: {
    fontSize: 12,
    color: COLORS.secondaryText,
    fontWeight: '500',
  },
  activePriorityText: {
    color: COLORS.primaryText,
    fontWeight: 'bold',
  },
  photoContainer: {
    marginTop: 4,
    marginBottom: 16,
  },
  photoBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  photoBtn: {
    flex: 1,
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  photoBtnText: {
    color: COLORS.primaryText,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  previewWrapper: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
  },
  removePhoto: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
  },
  submitBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.hoverLime,
  },
  submitText: {
    color: COLORS.primaryText,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
