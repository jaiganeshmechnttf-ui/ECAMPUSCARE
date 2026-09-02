import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS } from '../theme/colors';

export const LoginView = ({ onLoginSuccess }) => {
  const { login, loginWithGoogle } = useApp();

  const [name, setName] = useState('Prof. Sarah Jenkins');
  const [email, setEmail] = useState('sarah.jenkins@university.edu');
  const [role, setRole] = useState('faculty');
  const [building, setBuilding] = useState('Block A');
  const [room, setRoom] = useState('Room 302');

  const roles = [
    { id: 'faculty', label: 'Faculty / Staff', desc: 'Mobile App: Report incidents & track status' },
    { id: 'technician', label: 'Technician', desc: 'Mobile App: View assigned jobs & progress' },
    { id: 'manager', label: 'Facility Manager', desc: 'Mobile App: View team dispatch & status' },
    { id: 'admin', label: 'System Admin', desc: 'Web Operations Control Center Access' },
  ];

  const handleLogin = () => {
    login({
      name,
      email,
      role,
      defaultBuilding: building,
      defaultRoom: room,
    });
    if (onLoginSuccess) onLoginSuccess();
  };

  const handleGoogle = async () => {
    await loginWithGoogle('faculty.user@gmail.com', 'Faculty User');
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24, justifyContent: 'center', flexGrow: 1 }}>
      {/* Brand Logo */}
      <View style={styles.brandHeader}>
        <View style={styles.logoCircle}>
          <Ionicons name="sparkles" size={32} color={COLORS.primaryText} />
        </View>
        <Text style={styles.brandTitle}>CampusCare AI</Text>
        <Text style={styles.brandSub}>AI-Powered Campus Maintenance Operations</Text>
      </View>

      {/* Role Selector */}
      <Text style={styles.sectionLabel}>Select Login Role</Text>
      <View style={styles.roleGrid}>
        {roles.map((r) => (
          <TouchableOpacity
            key={r.id}
            style={[styles.roleCard, role === r.id && styles.activeRoleCard]}
            onPress={() => setRole(r.id)}
            activeOpacity={0.8}
          >
            <Text style={[styles.roleLabel, role === r.id && styles.activeRoleLabel]}>{r.label}</Text>
            <Text style={[styles.roleDesc, role === r.id && styles.activeRoleDesc]}>{r.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Inputs */}
      <Text style={styles.inputLabel}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholderTextColor={COLORS.secondaryText}
      />

      <Text style={styles.inputLabel}>University Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholderTextColor={COLORS.secondaryText}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, marginRight: 6 }}>
          <Text style={styles.inputLabel}>Assigned Building</Text>
          <TextInput
            style={styles.input}
            value={building}
            onChangeText={setBuilding}
            placeholderTextColor={COLORS.secondaryText}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 6 }}>
          <Text style={styles.inputLabel}>Assigned Room</Text>
          <TextInput
            style={styles.input}
            value={room}
            onChangeText={setRoom}
            placeholderTextColor={COLORS.secondaryText}
          />
        </View>
      </View>

      {/* Login Buttons */}
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.85}>
        <Text style={styles.loginBtnText}>Sign In as {role.toUpperCase()}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleBtn} onPress={handleGoogle} activeOpacity={0.85}>
        <Ionicons name="logo-google" size={18} color="#ffffff" style={{ marginRight: 8 }} />
        <Text style={styles.googleBtnText}>Sign In with Google Gmail</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBg,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.primaryText,
  },
  brandSub: {
    fontSize: 13,
    color: COLORS.secondaryText,
    marginTop: 4,
    fontWeight: '500',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primaryText,
    marginBottom: 10,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  roleCard: {
    width: '48%',
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  activeRoleCard: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.hoverLime,
  },
  roleLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primaryText,
  },
  activeRoleLabel: {
    color: COLORS.primaryText,
  },
  roleDesc: {
    fontSize: 10,
    color: COLORS.secondaryText,
    marginTop: 4,
  },
  activeRoleDesc: {
    color: COLORS.primaryText,
  },
  inputLabel: {
    fontSize: 12,
    color: COLORS.primaryText,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 8,
    padding: 10,
    color: COLORS.primaryText,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 13,
  },
  loginBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: COLORS.hoverLime,
  },
  loginBtnText: {
    color: COLORS.primaryText,
    fontSize: 15,
    fontWeight: 'bold',
  },
  googleBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryText,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  googleBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
