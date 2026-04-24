import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, PanResponder, Animated, TouchableOpacity, Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDayStore } from '../../store/useDayStore';
import { ProgressStrip } from '../../components/common/ProgressStrip';
import { haptics } from '../../utils/haptics';
import { COLORS } from '../../theme/colors';
import { getSegment } from '../../utils/personalityCalculator';

const { width } = Dimensions.get('window');
const SLIDER_WIDTH = width - 80;


export default function Day1Screen() {
  const router = useRouter();
  const completeDay = useDayStore((state) => state.completeDay);
  const [score, setScore] = useState(5);
  const [quizAnswers] = useState<Record<string, 'A' | 'B'>>({});

  const animX = React.useRef(new Animated.Value(SLIDER_WIDTH * 0.4)).current;
  const lastScore = React.useRef(5);

  const getScoreFromX = (x: number) => {
    const clamped = Math.max(0, Math.min(x, SLIDER_WIDTH));
    return Math.round((clamped / SLIDER_WIDTH) * 9) + 1;
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gs) => {
      const x = Math.max(0, Math.min(gs.moveX - 40, SLIDER_WIDTH));
      animX.setValue(x);
      const newScore = getScoreFromX(x);
      if (newScore !== lastScore.current) {
        lastScore.current = newScore;
        setScore(newScore);
        haptics.light();
      }
    },
  });

  const handleContinue = () => {
    const segment = getSegment(score);
    // Store score and navigate to HonestMoment
    router.push({ pathname: '/day1/honest-moment', params: { score, segment } });
  };

  const thumbLeft = animX.interpolate({
    inputRange: [0, SLIDER_WIDTH],
    outputRange: [0, SLIDER_WIDTH],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container}>
      <ProgressStrip currentDay={1} />

      <View style={styles.content}>
        {/* Score display */}
        <View style={styles.scoreWrap}>
          <Text style={styles.scoreNum}>{score}</Text>
          <Text style={styles.scoreSlash}>/10</Text>
        </View>

        <Text style={styles.question}>
          On a scale of 1–10, how connected{'\n'}do you feel to your partner right now?
        </Text>

        <Text style={styles.truthLine}>no right answer · only your truth</Text>

        {/* Slider */}
        <View style={styles.sliderArea} {...panResponder.panHandlers}>
          {/* Track */}
          <View style={styles.track}>
            <Animated.View
              style={[
                styles.trackFill,
                { width: thumbLeft },
              ]}
            />
          </View>
          {/* Thumb */}
          <Animated.View
            style={[styles.thumb, { left: thumbLeft }]}
          />
        </View>

        {/* Tick labels */}
        <View style={styles.ticks}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <Text key={n} style={[styles.tick, n === score && styles.tickActive]}>
              {n}
            </Text>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.cta} onPress={handleContinue}>
        <Text style={styles.ctaText}>That's my number →</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.day1.bg },
  content: { flex: 1, paddingHorizontal: 40, justifyContent: 'center', alignItems: 'center' },
  scoreWrap: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 20 },
  scoreNum: {
    fontSize: 96, lineHeight: 100,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: COLORS.day1.text,
  },
  scoreSlash: {
    fontSize: 28, color: COLORS.day1.accent,
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    marginBottom: 18, marginLeft: 4,
  },
  question: {
    fontSize: 18, textAlign: 'center', color: COLORS.day1.text,
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    lineHeight: 28, marginBottom: 12,
  },
  truthLine: {
    fontSize: 11, letterSpacing: 1.5, color: COLORS.day1.accent,
    textTransform: 'uppercase', marginBottom: 56,
    fontFamily: 'Inter_400Regular',
  },
  sliderArea: {
    width: SLIDER_WIDTH, height: 40, justifyContent: 'center', marginBottom: 12,
  },
  track: {
    height: 4, backgroundColor: COLORS.border, borderRadius: 2, overflow: 'hidden',
  },
  trackFill: {
    height: 4, backgroundColor: COLORS.day1.accent, borderRadius: 2,
  },
  thumb: {
    position: 'absolute', top: 10,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: COLORS.day1.text,
    shadowColor: COLORS.day1.text, shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  ticks: { flexDirection: 'row', justifyContent: 'space-between', width: SLIDER_WIDTH },
  tick: { fontSize: 11, color: COLORS.textMuted, fontFamily: 'Inter_400Regular' },
  tickActive: { color: COLORS.day1.text, fontWeight: '700' },
  cta: {
    margin: 32, backgroundColor: COLORS.day1.text,
    borderRadius: 100, paddingVertical: 18, alignItems: 'center',
  },
  ctaText: { color: '#fff', fontSize: 16, fontFamily: 'Inter_400Regular', letterSpacing: 0.5 },
});
