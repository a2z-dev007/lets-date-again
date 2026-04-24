import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressStrip } from '../../components/common/ProgressStrip';
import { useDayStore } from '../../store/useDayStore';
import { COLORS } from '../../theme/colors';
import questions from '../../data/mirrorGameQuestions.json';
import { haptics } from '../../utils/haptics';

export default function Day3Screen() {
  const router = useRouter();
  const completeDay = useDayStore((s) => s.completeDay);
  const [current, setCurrent] = useState(0);
  const [selfAnswers, setSelf] = useState<boolean[]>([]);
  const [partnerGuesses, setPartner] = useState<boolean[]>([]);
  const [phase, setPhase] = useState<'self' | 'partner' | 'result'>('self');
  const [currentSelf, setCurrentSelf] = useState<boolean | null>(null);

  const q = questions[current];
  const totalQ = questions.length;

  const handleSelf = (val: boolean) => {
    haptics.light();
    setCurrentSelf(val);
  };

  const handlePartner = (val: boolean) => {
    haptics.medium();
    const newPartner = [...partnerGuesses, val];
    setPartner(newPartner);
    const newSelf = [...selfAnswers, currentSelf!];
    setSelf(newSelf);
    setCurrentSelf(null);

    if (current < totalQ - 1) {
      setCurrent(current + 1);
      setPhase('self');
    } else {
      // Calculate score
      const matches = newSelf.filter((s, i) => s === newPartner[i]).length;
      const score = Math.round((matches / totalQ) * 100);
      completeDay(3, { predictionScore: score });
      setPhase('result');
    }
  };

  const goNext = () => {
    if (currentSelf !== null) setPhase('partner');
  };

  if (phase === 'result') {
    const matches = selfAnswers.filter((s, i) => s === partnerGuesses[i]).length;
    const pct = Math.round((matches / totalQ) * 100);
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: COLORS.day3.bg }]}>
        <View style={styles.content}>
          <Text style={styles.resultEmoji}>{pct >= 70 ? '🏆' : pct >= 50 ? '🌗' : '🌑'}</Text>
          <Text style={styles.scoreText}>{pct}%</Text>
          <Text style={styles.resultLabel}>Prediction Accuracy</Text>
          <Text style={styles.resultCopy}>
            {pct >= 70
              ? "You know your partner well. Now imagine what they'd say about you."
              : pct >= 50
              ? `You predicted ${pct}% — the average is 54%. Imagine knowing for real.`
               : "The gap between assumption and truth — that's exactly what this app closes."}
          </Text>
          <View style={styles.blurCard}>
            <Text style={styles.blurText}>🔒 See what your partner actually thinks</Text>
            <Text style={styles.blurSub}>Unlocks when they join</Text>
          </View>
          <TouchableOpacity
            style={[styles.cta, { backgroundColor: COLORS.day3.text }]}
            onPress={() => router.push('/home')}
          >
            <Text style={styles.ctaText}>Come back tomorrow →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.day3.bg }]}>
      <ProgressStrip currentDay={3} />
      <View style={styles.content}>
        <Text style={styles.phaseLabel}>
          {phase === 'self' ? '🪞 Your answer' : '💭 Your guess for them'}
        </Text>
        <Text style={styles.counter}>{current + 1}/{totalQ}</Text>
        <Text style={styles.statement}>{q.statement}</Text>

        <Text style={styles.answerLabel}>
          {phase === 'self' ? q.selfLabel : q.partnerLabel}
        </Text>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={[
              styles.answer,
              phase === 'self' && currentSelf === true && styles.answerSelected,
            ]}
            onPress={() => phase === 'self' ? handleSelf(true) : handlePartner(true)}
          >
            <Text style={styles.answerText}>✓ True</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.answer,
              phase === 'self' && currentSelf === false && styles.answerSelected,
            ]}
            onPress={() => phase === 'self' ? handleSelf(false) : handlePartner(false)}
          >
            <Text style={styles.answerText}>✗ False</Text>
          </TouchableOpacity>
        </View>

        {phase === 'self' && currentSelf !== null && (
          <TouchableOpacity
            style={[styles.cta, { backgroundColor: COLORS.day3.text, marginHorizontal: 0 }]}
            onPress={goNext}
          >
            <Text style={styles.ctaText}>Now guess for them →</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 32, paddingTop: 24 },
  phaseLabel: {
    fontSize: 13, fontFamily: 'Inter_400Regular',
    color: COLORS.day3.accent, marginBottom: 4,
  },
  counter: {
    fontSize: 11, fontFamily: 'Inter_400Regular',
    color: COLORS.textMuted, letterSpacing: 1, marginBottom: 24,
  },
  statement: {
    fontSize: 22, fontFamily: 'PlayfairDisplay_400Regular_Italic',
    color: COLORS.day3.text, lineHeight: 32, marginBottom: 12,
  },
  answerLabel: {
    fontSize: 13, fontFamily: 'Inter_400Regular',
    color: COLORS.textMuted, marginBottom: 24,
  },
  buttons: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  answer: {
    flex: 1, borderRadius: 20, paddingVertical: 20, alignItems: 'center',
    backgroundColor: '#fff', borderWidth: 1.5, borderColor: COLORS.border,
  },
  answerSelected: { borderColor: COLORS.day3.accent, backgroundColor: COLORS.day3.accent + '15' },
  answerText: { fontSize: 16, fontFamily: 'Inter_400Regular', color: COLORS.text, fontWeight: '600' },
  cta: { borderRadius: 100, paddingVertical: 18, alignItems: 'center', marginHorizontal: 28, marginTop: 16 },
  ctaText: { color: '#fff', fontSize: 16, fontFamily: 'Inter_400Regular' },

  // Result styles
  resultEmoji: { fontSize: 72, textAlign: 'center', marginTop: 48, marginBottom: 16 },
  scoreText: {
    fontSize: 72, fontFamily: 'PlayfairDisplay_700Bold',
    color: COLORS.day3.text, textAlign: 'center', lineHeight: 80,
  },
  resultLabel: {
    fontSize: 11, textAlign: 'center', fontFamily: 'Inter_400Regular',
    color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 24,
  },
  resultCopy: {
    fontSize: 16, fontFamily: 'PlayfairDisplay_400Regular_Italic',
    color: COLORS.text, lineHeight: 26, textAlign: 'center', marginBottom: 32,
  },
  blurCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 24,
    alignItems: 'center', marginBottom: 40,
    borderWidth: 1, borderColor: COLORS.border,
  },
  blurText: { fontSize: 14, fontFamily: 'Inter_400Regular', color: COLORS.textSecondary, marginBottom: 4 },
  blurSub: { fontSize: 11, fontFamily: 'Inter_400Regular', color: COLORS.textMuted, fontStyle: 'italic' },
});
