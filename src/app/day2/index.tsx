import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressStrip } from '../../components/common/ProgressStrip';
import { useDayStore } from '../../store/useDayStore';
import { COLORS } from '../../theme/colors';
import moodOptions from '../../data/moodOptions.json';
import { haptics } from '../../utils/haptics';

export default function Day2Screen() {
  const router = useRouter();
  const completeDay = useDayStore((s) => s.completeDay);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [reflection, setReflection] = useState('');
  const [step, setStep] = useState<'mood' | 'followup'>('mood');

  const mood = moodOptions.find((m) => m.id === selectedMood);

  const handleMoodSelect = (id: string) => {
    haptics.medium();
    setSelectedMood(id);
  };

  const handleNext = () => {
    if (!selectedMood) return;
    setStep('followup');
  };

  const handleDone = () => {
    haptics.success();
    completeDay(2, { mood: selectedMood, reflection });
    router.push('/home');
  };

  if (step === 'followup' && mood) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: COLORS.day2.bg }]}>
        <ProgressStrip currentDay={2} />
        <View style={styles.content}>
          {/* Candle visual */}
          <View style={styles.candleWrap}>
            <Text style={styles.candleEmoji}>🕯️</Text>
            <View style={[styles.candleGlow, { backgroundColor: mood.color + '30' }]} />
          </View>

          <Text style={styles.moodChosen}>{mood.emoji} {mood.label}</Text>
          <Text style={styles.followUpQ}>{mood.followUp}</Text>

          <TextInput
            style={styles.input}
            placeholder="Write it here, or just sit with it…"
            placeholderTextColor={COLORS.textMuted}
            multiline
            value={reflection}
            onChangeText={setReflection}
            textAlignVertical="top"
          />
        </View>
        <TouchableOpacity style={[styles.cta, { backgroundColor: COLORS.day2.text }]} onPress={handleDone}>
          <Text style={styles.ctaText}>Save to my jar →</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.day2.bg }]}>
      <ProgressStrip currentDay={2} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>The Mood Room</Text>
        <Text style={styles.sub}>How does your relationship feel today?</Text>

        <View style={styles.moodGrid}>
          {moodOptions.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[
                styles.moodCard,
                selectedMood === m.id && { borderColor: m.color, backgroundColor: m.color + '15' },
              ]}
              onPress={() => handleMoodSelect(m.id)}
            >
              <Text style={styles.moodEmoji}>{m.emoji}</Text>
              <Text style={[styles.moodLabel, selectedMood === m.id && { color: COLORS.day2.text }]}>
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.cta, !selectedMood && styles.ctaDisabled, { backgroundColor: COLORS.day2.text }]}
          disabled={!selectedMood}
          onPress={handleNext}
        >
          <Text style={styles.ctaText}>Continue →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 28, paddingBottom: 60 },
  title: {
    fontSize: 32, fontFamily: 'PlayfairDisplay_700Bold',
    color: COLORS.day2.text, marginBottom: 8,
  },
  sub: {
    fontSize: 15, fontFamily: 'Inter_400Regular',
    color: COLORS.textSecondary, marginBottom: 32,
  },
  moodGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 40,
  },
  moodCard: {
    width: '46%', backgroundColor: '#fff', borderRadius: 20,
    paddingVertical: 20, alignItems: 'center',
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  moodEmoji: { fontSize: 32, marginBottom: 8 },
  moodLabel: {
    fontSize: 13, fontFamily: 'Inter_400Regular',
    color: COLORS.textSecondary, fontWeight: '500',
  },
  candleWrap: { alignItems: 'center', marginBottom: 32, marginTop: 16 },
  candleEmoji: { fontSize: 80 },
  candleGlow: { width: 80, height: 20, borderRadius: 40, marginTop: -10 },
  moodChosen: {
    fontSize: 28, fontFamily: 'PlayfairDisplay_700Bold',
    color: COLORS.day2.text, marginBottom: 20,
  },
  followUpQ: {
    fontSize: 18, fontFamily: 'PlayfairDisplay_400Regular_Italic',
    color: COLORS.day2.text, lineHeight: 28, marginBottom: 24,
  },
  input: {
    backgroundColor: '#fff', borderRadius: 20, padding: 20, height: 140,
    fontSize: 15, fontFamily: 'Inter_400Regular', color: COLORS.text,
    borderWidth: 1, borderColor: COLORS.border,
  },
  cta: {
    marginHorizontal: 28, marginVertical: 8,
    borderRadius: 100, paddingVertical: 18, alignItems: 'center',
  },
  ctaDisabled: { opacity: 0.35 },
  ctaText: { color: '#fff', fontSize: 16, fontFamily: 'Inter_400Regular' },
});
