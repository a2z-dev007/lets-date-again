import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../theme/colors';
import questions from '../../data/sparkQuizQuestions.json';
import { checkCalculatePersonality } from '../../utils/personalityCalculator';
import { haptics } from '../../utils/haptics';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

export function Day1SparkQuiz() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { score } = (params || {}) as { score: number };
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B'>>({});
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const q = questions[current];
  const progress = (current / questions.length) * 100;

  const handleAnswer = (choice: 'A' | 'B') => {
    haptics.medium();
    const newAnswers = { ...answers, [q.id]: choice };
    setAnswers(newAnswers);

    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      if (current < questions.length - 1) {
        setCurrent(current + 1);
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      } else {
        // Quiz done — calculate personality
        const type = calculatePersonality(newAnswers);
        router.push({ pathname: '/day1/personality-result', params: { score, type } });
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.counter}>{current + 1} / {questions.length}</Text>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.badgePill}>
          <Text style={styles.badge}>{q.badge}</Text>
        </View>

        <Text style={styles.question}>{q.question}</Text>

        <TouchableOpacity style={styles.option} onPress={() => handleAnswer('A')}>
          <Text style={styles.optionLabel}>A</Text>
          <Text style={styles.optionText}>{q.optionA}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.option, styles.optionB]} onPress={() => handleAnswer('B')}>
          <Text style={styles.optionLabel}>B</Text>
          <Text style={styles.optionText}>{q.optionB}</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

function calculatePersonality(answers: Record<string, 'A' | 'B'>) {
  let expressive = 0, deep = 0;
  const aMap: Record<string, 'expressive' | 'active' | 'deep' | 'present'> = {
    q1: 'expressive', q2: 'deep', q3: 'deep', q4: 'expressive',
    q5: 'deep', q6: 'expressive', q7: 'expressive',
  };
  const bMap: Record<string, 'expressive' | 'active' | 'deep' | 'present'> = {
    q1: 'active', q2: 'present', q3: 'present', q4: 'active',
    q5: 'active', q6: 'active', q7: 'deep',
  };
  Object.entries(answers).forEach(([k, v]) => {
    const axis = v === 'A' ? aMap[k] : bMap[k];
    if (axis === 'expressive') expressive++;
    if (axis === 'deep') deep++;
  });
  const isExpressive = expressive >= 3;
  const isDeep = deep >= 3;
  if (isExpressive && isDeep) return 'deep_current';
  if (isExpressive) return 'steady_flame';
  if (isDeep) return 'shifting_tide';
  return 'electric_spark';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.day1.bg },
  progressBg: { height: 3, backgroundColor: COLORS.border, marginHorizontal: 0 },
  progressFill: { height: 3, backgroundColor: COLORS.day1.accent },
  counter: {
    textAlign: 'right', marginRight: 24, marginTop: 12, marginBottom: 8,
    fontSize: 11, fontFamily: 'Inter_400Regular', color: COLORS.textMuted,
    letterSpacing: 1,
  },
  content: { flex: 1, paddingHorizontal: 32, paddingTop: 20 },
  badgePill: {
    alignSelf: 'flex-start', backgroundColor: COLORS.day1.accent + '20',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginBottom: 24,
  },
  badge: { fontSize: 12, fontFamily: 'Inter_400Regular', color: COLORS.day1.text },
  question: {
    fontSize: 24, fontFamily: 'PlayfairDisplay_400Regular_Italic',
    color: COLORS.day1.text, lineHeight: 34, marginBottom: 40,
  },
  option: {
    backgroundColor: '#fff', borderRadius: 20, padding: 20,
    marginBottom: 16, flexDirection: 'row', alignItems: 'flex-start',
    borderWidth: 1.5, borderColor: COLORS.border,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  optionB: { borderColor: COLORS.day1.accent + '60' },
  optionLabel: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.day1.bg,
    textAlign: 'center', lineHeight: 28, fontFamily: 'Inter_400Regular',
    fontWeight: '700', fontSize: 12, color: COLORS.day1.text, marginRight: 14,
  },
  optionText: {
    flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular',
    color: COLORS.text, lineHeight: 22,
  },
});
