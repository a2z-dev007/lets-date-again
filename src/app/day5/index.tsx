import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView, Share,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDayStore } from '../../store/useDayStore';
import { useUserStore } from '../../store/useUserStore';
import { COLORS } from '../../theme/colors';
import badges from '../../data/badges.json';
import { haptics } from '../../utils/haptics';

function computeBadge(store: ReturnType<typeof useDayStore.getState>) {
  const { day1, day2, day3, day4 } = store;
  // Axis A: Expressive vs Active
  const expressive = day1.personalityType === 'steady_flame' || day1.personalityType === 'deep_current';
  // Axis B: Deep vs Present
  const deep = day3.predictionScore >= 60;
  // Axis C: Building vs Protecting
  const building = day4.memoryAdded;

  const axA = expressive ? 'expressive' : 'active';
  const axB = deep ? 'deep' : 'present';
  const axC = building ? 'building' : 'protecting';

  const match = badges.find(
    (b) => b.axes.a === axA && b.axes.b === axB && b.axes.c === axC
  );
  return match || badges[badges.length - 1];
}

export default function Day5Screen() {
  const router = useRouter();
  const store = useDayStore();
  const name = useUserStore((s) => s.name);
  const completeDay = useDayStore((s) => s.completeDay);
  const [step, setStep] = useState<'badge' | 'report' | 'invite'>('badge');

  const badge = computeBadge(useDayStore.getState());

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (step !== 'badge') return;
    haptics.success();
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 5 }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0, duration: 1200, useNativeDriver: true }),
        ])
      ),
    ]).start();
  }, [step]);

  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.8] });

  const handleShare = async () => {
    await Share.share({
      message: `I completed 5 days on Let's Date Again and I'm ${badge.name}. ${badge.emoji} — "${badge.description}" Made with Let's Date Again.`,
    });
  };

  // ─── PARTNER INVITE STEP ─────────────────────────────────────────────────────
  if (step === 'invite') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: COLORS.day5.bg }]}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.inviteTitle}>What do you want to do next?</Text>
          <Text style={styles.inviteSub}>
            You've been doing this alone for 5 days.{'\n'}
            Imagine what it feels like when both of you show up.
          </Text>
          <View style={styles.jarFull}>
            <Text style={styles.jarFullEmoji}>🫙</Text>
            <Text style={styles.jarFullLabel}>Your jar is full.</Text>
          </View>
          <TouchableOpacity
            style={[styles.cta, { backgroundColor: COLORS.day5.text }]}
            onPress={async () => {
              await Share.share({
                message: `I found something I want us to try together — just for us. No apps, no drama. Just five minutes a day. Will you join me? 💌\n\nMade with Let's Date Again.`,
              });
              completeDay(5, { badgeAwarded: badge.name });
              router.push('/home');
            }}
          >
            <Text style={styles.ctaText}>Invite your partner 💌</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              completeDay(5, { badgeAwarded: badge.name });
              router.push('/home');
            }}
            style={styles.ghost}
          >
            <Text style={styles.ghostText}>Continue solo for now →</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── REPORT CARD STEP ────────────────────────────────────────────────────────
  if (step === 'report') {
    const d1Score = store.day1.sliderScore || 5;
    const d2Score = (store.day2 as any).moodScore || 6;
    const d3Score = Math.round((store.day3.predictionScore / 100) * 10);
    const d4Score = store.day4.memoryAdded ? 8 : 4;
    const d5Score = Math.round((d1Score + d2Score + d3Score + d4Score) / 4);
    const bars = [d1Score, d2Score, d3Score, d4Score, d5Score];
    const maxBar = Math.max(...bars);

    return (
      <SafeAreaView style={[styles.container, { backgroundColor: COLORS.day5.bg }]}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.reportTitle}>Your 5-Day Report</Text>

          {/* Mood chart */}
          <View style={styles.chart}>
            {bars.map((v, i) => (
              <View key={i} style={styles.barWrap}>
                <View style={[styles.bar, { height: Math.max(12, (v / maxBar) * 100) }]} />
                <Text style={styles.barLabel}>D{i + 1}</Text>
              </View>
            ))}
          </View>

          {/* Type deep-dive */}
          <View style={styles.typeCard}>
            <Text style={styles.typeCardTitle}>{store.day1.personalityType?.replace(/_/g, ' ')}</Text>
            <Text style={styles.typeCardSub}>Your relationship personality</Text>
          </View>

          {/* Badge recap */}
          <View style={styles.badgeRecap}>
            <Text style={styles.badgeEmojiSm}>{badge.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.badgeNameSm}>{badge.name}</Text>
              <Text style={styles.badgeDescSm}>{badge.description}</Text>
            </View>
          </View>

          <TouchableOpacity style={[styles.cta, { backgroundColor: COLORS.day5.text }]} onPress={() => setStep('invite')}>
            <Text style={styles.ctaText}>See what's next →</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── BADGE CELEBRATION STEP ───────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.day5.bg }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.badgeEyebrow}>5 days complete · {name}</Text>
        <Text style={styles.badgeHeadline}>You earned a badge.</Text>

        {/* Badge visual */}
        <View style={styles.badgeWrap}>
          <Animated.View style={[styles.badgeGlow, { opacity: glowOpacity }]} />
          <Animated.View style={[styles.badgeCircle, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
          </Animated.View>
        </View>

        <Text style={styles.badgeName}>{badge.name}</Text>
        <Text style={styles.badgeDesc}>{badge.description}</Text>

        <View style={styles.traitsRow}>
          {badge.traits.map((t, i) => (
            <View key={i} style={styles.traitPill}>
              <Text style={styles.traitText}>{t}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={[styles.cta, { backgroundColor: COLORS.day5.text }]} onPress={() => setStep('report')}>
          <Text style={styles.ctaText}>See your 5-day story →</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} style={styles.ghost}>
          <Text style={styles.ghostText}>Share my badge</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 32, paddingBottom: 60, paddingTop: 24 },
  badgeEyebrow: {
    fontSize: 11, fontFamily: 'Inter_400Regular', color: COLORS.day5.accent,
    textTransform: 'uppercase', letterSpacing: 2, textAlign: 'center', marginBottom: 8,
  },
  badgeHeadline: {
    fontSize: 32, fontFamily: 'PlayfairDisplay_700Bold',
    color: COLORS.day5.text, textAlign: 'center', marginBottom: 40,
  },
  badgeWrap: { alignItems: 'center', marginBottom: 28 },
  badgeGlow: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: COLORS.day5.accent, top: -10,
  },
  badgeCircle: {
    width: 160, height: 160, borderRadius: 80, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.day5.accent, shadowOpacity: 0.4, shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 }, elevation: 12,
  },
  badgeEmoji: { fontSize: 72 },
  badgeName: {
    fontSize: 28, fontFamily: 'PlayfairDisplay_700Bold',
    color: COLORS.day5.text, textAlign: 'center', marginBottom: 12,
  },
  badgeDesc: {
    fontSize: 15, fontFamily: 'PlayfairDisplay_400Regular_Italic',
    color: COLORS.textSecondary, lineHeight: 24, textAlign: 'center', marginBottom: 24,
  },
  traitsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 40 },
  traitPill: {
    paddingHorizontal: 16, paddingVertical: 6, borderRadius: 100,
    backgroundColor: COLORS.day5.accent + '20',
  },
  traitText: { fontSize: 13, fontFamily: 'Inter_400Regular', color: COLORS.day5.text },
  cta: { borderRadius: 100, paddingVertical: 18, alignItems: 'center', marginBottom: 12 },
  ctaText: { color: '#fff', fontSize: 16, fontFamily: 'Inter_400Regular' },
  ghost: { alignItems: 'center', paddingVertical: 12 },
  ghostText: { fontSize: 13, fontFamily: 'Inter_400Regular', color: COLORS.day5.accent },
  // Report card
  reportTitle: {
    fontSize: 32, fontFamily: 'PlayfairDisplay_700Bold',
    color: COLORS.day5.text, marginBottom: 32,
  },
  chart: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 12, height: 120,
    marginBottom: 32, backgroundColor: '#fff', borderRadius: 20, padding: 16,
  },
  barWrap: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  bar: { width: '100%', backgroundColor: COLORS.day5.accent, borderRadius: 6, marginBottom: 4 },
  barLabel: { fontSize: 10, fontFamily: 'Inter_400Regular', color: COLORS.textMuted },
  typeCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 16,
    borderLeftWidth: 3, borderLeftColor: COLORS.day5.accent,
  },
  typeCardTitle: {
    fontSize: 18, fontFamily: 'PlayfairDisplay_700Bold',
    color: COLORS.day5.text, textTransform: 'capitalize',
  },
  typeCardSub: { fontSize: 12, fontFamily: 'Inter_400Regular', color: COLORS.textMuted, marginTop: 4 },
  badgeRecap: {
    backgroundColor: '#fff', borderRadius: 20, padding: 20,
    marginBottom: 32, flexDirection: 'row', alignItems: 'center', gap: 16,
  },
  badgeEmojiSm: { fontSize: 40 },
  badgeNameSm: { fontSize: 16, fontFamily: 'PlayfairDisplay_700Bold', color: COLORS.day5.text },
  badgeDescSm: { fontSize: 12, fontFamily: 'Inter_400Regular', color: COLORS.textSecondary, marginTop: 4 },
  // Invite
  inviteTitle: {
    fontSize: 28, fontFamily: 'PlayfairDisplay_700Bold',
    color: COLORS.day5.text, marginBottom: 12,
  },
  inviteSub: {
    fontSize: 16, fontFamily: 'PlayfairDisplay_400Regular_Italic',
    color: COLORS.textSecondary, lineHeight: 26, marginBottom: 40,
  },
  jarFull: { alignItems: 'center', marginBottom: 40 },
  jarFullEmoji: { fontSize: 80 },
  jarFullLabel: {
    fontSize: 13, fontFamily: 'Inter_400Regular',
    color: COLORS.textMuted, marginTop: 8,
  },
});
