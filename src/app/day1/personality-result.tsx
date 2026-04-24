import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../theme/colors';
import personalityTypes from '../../data/personalityTypes.json';
import { useDayStore } from '../../store/useDayStore';
import { haptics } from '../../utils/haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';

export function Day1PersonalityResult() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { score, type } = (params || { score: 5, type: 'steady_flame' }) as {
    score: number; type: string;
  };
  const completeDay = useDayStore((s) => s.completeDay);

  const data = personalityTypes[type as keyof typeof personalityTypes];

  // Stagger animations
  const titleAnim = useRef(new Animated.Value(0)).current;
  const descAnim = useRef(new Animated.Value(0)).current;
  const traitsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    haptics.success();
    Animated.stagger(200, [
      Animated.timing(titleAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(descAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(traitsAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleDone = () => {
    completeDay(1, { sliderScore: score, personalityType: type });
    router.push('/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Emoji */}
        <Text style={styles.emoji}>{data.emoji}</Text>

        {/* Type name */}
        <Animated.Text style={[styles.typeName, { opacity: titleAnim }]}>
          {data.name}
        </Animated.Text>

        {/* Tagline */}
        <Animated.Text style={[styles.tagline, { opacity: titleAnim }]}>
          "{data.tagline}"
        </Animated.Text>

        {/* Description */}
        <Animated.Text style={[styles.description, { opacity: descAnim }]}>
          {data.description}
        </Animated.Text>

        {/* Traits */}
        <Animated.View style={[styles.traitsRow, { opacity: traitsAnim }]}>
          {data.traits.map((t, i) => (
            <View key={i} style={styles.traitPill}>
              <Text style={styles.traitText}>{t}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Growth area */}
        <View style={styles.growthCard}>
          <Text style={styles.growthLabel}>Your growth edge</Text>
          <Text style={styles.growthText}>{data.growth}</Text>
        </View>

        {/* Question hook */}
        <Text style={styles.hook}>
          Would your partner say the same thing{'\n'}about themselves?
        </Text>

        {/* CTAs */}
        <TouchableOpacity style={styles.cta} onPress={handleDone}>
          <Text style={styles.ctaText}>Save my result · Come back tomorrow →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.day1.bg },
  scroll: { paddingHorizontal: 32, paddingTop: 32, paddingBottom: 60 },
  emoji: { fontSize: 64, marginBottom: 16, textAlign: 'center' },
  typeName: {
    fontSize: 36, fontFamily: 'PlayfairDisplay_700Bold',
    color: COLORS.day1.text, textAlign: 'center', marginBottom: 12,
  },
  tagline: {
    fontSize: 16, fontFamily: 'PlayfairDisplay_400Regular_Italic',
    color: COLORS.day1.accent, textAlign: 'center', lineHeight: 24, marginBottom: 28,
  },
  description: {
    fontSize: 16, fontFamily: 'Inter_400Regular',
    color: COLORS.textSecondary, lineHeight: 26, textAlign: 'center', marginBottom: 28,
  },
  traitsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 32 },
  traitPill: {
    backgroundColor: COLORS.day1.accent + '20',
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6,
  },
  traitText: { fontSize: 13, fontFamily: 'Inter_400Regular', color: COLORS.day1.text },
  growthCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 32,
    borderLeftWidth: 3, borderLeftColor: COLORS.day1.accent,
  },
  growthLabel: {
    fontSize: 10, fontFamily: 'Inter_400Regular', color: COLORS.textMuted,
    textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6,
  },
  growthText: {
    fontSize: 15, fontFamily: 'PlayfairDisplay_400Regular_Italic',
    color: COLORS.text, lineHeight: 22,
  },
  hook: {
    fontSize: 15, fontFamily: 'PlayfairDisplay_400Regular_Italic',
    color: COLORS.day1.text, textAlign: 'center', lineHeight: 24, marginBottom: 40,
  },
  cta: {
    backgroundColor: COLORS.day1.text, borderRadius: 100,
    paddingVertical: 18, alignItems: 'center',
  },
  ctaText: { color: '#fff', fontSize: 15, fontFamily: 'Inter_400Regular' },
});
