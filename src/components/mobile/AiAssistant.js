import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme/colors';

export const AiAssistant = () => {
  const { parseAiPrompt, createComplaint, setMobileTab } = useApp();
  const [inputPrompt, setInputPrompt] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'ai',
      text: 'Hello! I am your CampusCare AI Assistant. Describe any facility or equipment issue in natural language (e.g., "The AC in Block A Room 302 is not cooling").',
      parsedResult: null,
    }
  ]);

  const quickPrompts = [
    'AC in Block A Room 302 is blowing warm air',
    'Projector in Room 204 has no display signal',
    'Flickering overhead LED lights in Room 401',
    'Wi-Fi network disconnected in Digital Hub 3',
  ];

  const handleSend = (textToSend) => {
    const text = textToSend || inputPrompt;
    if (!text.trim()) return;

    // Add user message
    const userMsg = { id: `u_${Date.now()}`, sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputPrompt('');

    // Process with AI parser
    setTimeout(() => {
      const parsed = parseAiPrompt(text);
      const aiMsg = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: `I analyzed your report. Here is what I detected:`,
        parsedResult: parsed,
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 600);
  };

  const handleCreateFromAi = async (parsed) => {
    await createComplaint({
      equipment: parsed.equipment,
      category: parsed.category,
      building: parsed.building,
      room: parsed.room,
      floor: parsed.floor,
      problem: parsed.issue,
      description: `Natural language report parsed by AI: "${parsed.issue}". Troubleshooting attempted: ${parsed.troubleshootingAdvice}`,
      priority: parsed.priority || 'High',
    });
    setMobileTab('requests');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.aiBadge}>
            <Ionicons name="sparkles" size={18} color={COLORS.primaryText} />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.title}>CampusCare AI Assistant</Text>
            <Text style={styles.subTitle}>Natural Language Incident Logging</Text>
          </View>
        </View>
      </View>

      {/* Suggested Quick Prompts */}
      <View style={styles.quickBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {quickPrompts.map((qp, idx) => (
            <TouchableOpacity key={idx} style={styles.qpChip} onPress={() => handleSend(qp)}>
              <Ionicons name="flash-outline" size={12} color={COLORS.primaryText} style={{ marginRight: 4 }} />
              <Text style={styles.qpText}>{qp}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Message History Stream */}
      <ScrollView style={styles.chatStream} contentContainerStyle={{ paddingVertical: 12 }}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.msgBubble,
              msg.sender === 'user' ? styles.userBubble : styles.aiBubble
            ]}
          >
            <Text style={[styles.msgText, msg.sender === 'user' ? styles.userMsgText : styles.aiMsgText]}>
              {msg.text}
            </Text>

            {msg.parsedResult && (
              <View style={styles.parsedCard}>
                <View style={styles.parsedRow}>
                  <Text style={styles.parsedLabel}>Equipment:</Text>
                  <Text style={styles.parsedVal}>{msg.parsedResult.equipment} ({msg.parsedResult.category})</Text>
                </View>
                <View style={styles.parsedRow}>
                  <Text style={styles.parsedLabel}>Location:</Text>
                  <Text style={styles.parsedVal}>{msg.parsedResult.building} · {msg.parsedResult.room}</Text>
                </View>
                <View style={styles.parsedRow}>
                  <Text style={styles.parsedLabel}>Issue:</Text>
                  <Text style={styles.parsedVal}>{msg.parsedResult.issue}</Text>
                </View>

                {/* KB Advice */}
                <View style={styles.kbBox}>
                  <Ionicons name="information-circle" size={16} color={COLORS.primaryText} />
                  <Text style={styles.kbText}>
                    <Text style={{ fontWeight: 'bold' }}>Troubleshooting Step: </Text>
                    {msg.parsedResult.troubleshootingAdvice}
                  </Text>
                </View>

                {/* Create Ticket Button */}
                <TouchableOpacity
                  style={styles.createTicketBtn}
                  onPress={() => handleCreateFromAi(msg.parsedResult)}
                  activeOpacity={0.85}
                >
                  <Ionicons name="add-circle-outline" size={18} color={COLORS.primaryText} style={{ marginRight: 6 }} />
                  <Text style={styles.createTicketText}>Auto-Generate Incident Ticket</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type facility issue..."
          placeholderTextColor={COLORS.secondaryText}
          value={inputPrompt}
          onChangeText={setInputPrompt}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={() => handleSend(null)} activeOpacity={0.85}>
          <Ionicons name="send" size={18} color={COLORS.primaryText} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBg,
  },
  header: {
    padding: 16,
    backgroundColor: COLORS.secondaryBg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  aiBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryText,
  },
  subTitle: {
    fontSize: 11,
    color: COLORS.secondaryText,
  },
  quickBar: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.secondaryBg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  qpChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  qpText: {
    fontSize: 11,
    color: COLORS.primaryText,
  },
  chatStream: {
    flex: 1,
    paddingHorizontal: 16,
  },
  msgBubble: {
    maxWidth: '85%',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.accent,
    borderWidth: 1,
    borderColor: COLORS.hoverLime,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.secondaryBg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  msgText: {
    fontSize: 13,
    lineHeight: 18,
  },
  userMsgText: {
    color: COLORS.primaryText,
    fontWeight: '500',
  },
  aiMsgText: {
    color: COLORS.primaryText,
  },
  parsedCard: {
    backgroundColor: COLORS.primaryBg,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  parsedRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  parsedLabel: {
    width: 80,
    fontSize: 11,
    color: COLORS.secondaryText,
    fontWeight: 'bold',
  },
  parsedVal: {
    flex: 1,
    fontSize: 11,
    color: COLORS.primaryText,
    fontWeight: '600',
  },
  kbBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 8,
    padding: 8,
    marginTop: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  kbText: {
    flex: 1,
    fontSize: 11,
    color: COLORS.primaryText,
    marginLeft: 6,
  },
  createTicketBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.hoverLime,
  },
  createTicketText: {
    color: COLORS.primaryText,
    fontSize: 12,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: COLORS.secondaryBg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.primaryBg,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: COLORS.primaryText,
    fontSize: 13,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.hoverLime,
  },
});
