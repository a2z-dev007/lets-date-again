import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../theme/colors';
import { ProgressStrip } from '../../components/common/ProgressStrip';
import { haptics } from '../../utils/haptics';

export default function Day4DailyTwo() {
  const router = useRouter();
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [step, setStep] = useState(1);

  const next = () => {
    haptics.medium();
    if (step === 1) setStep(2);
    else router.push('/day4');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressStrip currentDay={4} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.content}>
          <Text style={styles.count}>{step} of 2</Text>
          <Text style={styles.question}>
            {step === 1 
              ? "What's the one emotion you're carrying into your relationship today?" 
              : "What's one thing you've learned about your relationship this week?"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Type your answer..."
            placeholderTextColor={COLORS.textMuted}
            value={step === 1 ? q1 : q2}
            onChangeText={step === 1 ? setQ1 : setQ2}
            multiline
          />

          <TouchableOpacity 
            style={[styles.cta, { backgroundColor: COLORS.day4.text }]}
            onPress={next}
          >
            <Text style={styles.ctaText}>{step === 1 ? "Next question" : "Back to Jar"}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.day4.bg },
  content: { flex: 1, paddingHorizontal: 32, justifyContent: 'center' },
  count: { fontSize: 12, fontFamily: 'Inter_400Regular', color: COLORS.day4.accent, textTransform: 'uppercase', marginBottom: 8 },
  question: { fontSize: 24, fontFamily: 'PlayfairDisplay_700Bold', color: COLORS.day4.text, marginBottom: 32 },
  input: { height: 120, fontSize: 18, fontFamily: 'PlayfairDisplay_400Regular_Italic', color: COLORS.text, borderBottomWidth: 1, borderBottomColor: COLORS.border, marginBottom: 40 },
  cta: { borderRadius: 100, paddingVertical: 18, alignItems: 'center' },
  ctaText: { color: '#fff', fontSize: 16, fontFamily: 'Inter_400Regular' },
});
