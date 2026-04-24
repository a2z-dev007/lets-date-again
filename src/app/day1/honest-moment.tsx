import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressStrip } from '../../components/common/ProgressStrip';
import { COLORS } from '../../theme/colors';
import honestMomentCopy from '../../data/honestMomentCopy.json';

type RouteParams = { score: number; segment: string };

export function Day1HonestMoment() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { score, segment } = params as RouteParams;

  const copy = honestMomentCopy[segment as keyof typeof honestMomentCopy];

  return (
    <SafeAreaView style={styles.container}>
      <ProgressStrip currentDay={1} />

      <View style={styles.content}>
        <Text style={styles.score}>{score}</Text>
        <Text style={styles.headline}>{copy.headline}</Text>
        <Text style={styles.body}>{copy.copy.replace('{score}', String(score))}</Text>

        <View style={styles.divider} />
        <Text style={styles.quizTeaser}>The Spark Quiz reveals your{'\n'}relationship personality type.</Text>
      </View>

      <TouchableOpacity
        style={styles.cta}
        onPress={() => router.push({ pathname: '/day1/spark-quiz', params: { score } })}
      >
        <Text style={styles.ctaText}>Take the Spark Quiz →</Text>
        <Text style={styles.ctaSub}>7 questions · 90 seconds</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.day1.bg },
  content: { flex: 1, paddingHorizontal: 40, paddingTop: 24 },
  score: {
    fontSize: 80, fontFamily: 'PlayfairDisplay_700Bold',
    color: COLORS.day1.text, lineHeight: 88, marginBottom: 20,
  },
  headline: {
    fontSize: 22, fontFamily: 'PlayfairDisplay_400Regular_Italic',
    color: COLORS.day1.text, marginBottom: 16,
  },
  body: {
    fontSize: 16, fontFamily: 'Inter_400Regular',
    color: COLORS.textSecondary, lineHeight: 26,
  },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 32 },
  quizTeaser: {
    fontSize: 13, fontFamily: 'PlayfairDisplay_400Regular_Italic',
    color: COLORS.day1.accent, textAlign: 'center', lineHeight: 20,
  },
  cta: {
    margin: 32, backgroundColor: COLORS.day1.text,
    borderRadius: 100, paddingVertical: 18, alignItems: 'center',
  },
  ctaText: { color: '#fff', fontSize: 16, fontFamily: 'Inter_400Regular' },
  ctaSub: { color: '#ffffff80', fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },
});
