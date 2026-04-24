import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, TextInput,
  Animated, ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressStrip } from '../../components/common/ProgressStrip';
import { useDayStore } from '../../store/useDayStore';
import { COLORS } from '../../theme/colors';
import { haptics } from '../../utils/haptics';

const MEMORY_TYPES = [
  { id: 'text', emoji: '✍️', label: 'Write it' },
  { id: 'emoji', emoji: '😊', label: 'Emoji + date' },
  { id: 'skip', emoji: '⏭', label: 'Skip today' },
];

export default function Day4Screen() {
  const router = useRouter();
  const completeDay = useDayStore((s) => s.completeDay);
  const fillAnim = useRef(new Animated.Value(0)).current;

  const [step, setStep] = useState<'jar' | 'compliment' | 'dropbox'>('jar');
  const [memoryType, setMemoryType] = useState<string | null>(null);
  const [memoryText, setMemoryText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [compliment, setCompliment] = useState('');
  const [dropText, setDropText] = useState('');
  const [jarFilled, setJarFilled] = useState(false);

  const COMPLIMENTS = ['Patient', 'Warm', 'Present', 'Thoughtful', 'Brave', 'Honest', 'Kind', 'Strong'];
  const EMOJIS = ['🌸', '☕', '🌙', '✨', '🎵', '🌿', '💌', '🏡'];

  const fillJar = () => {
    haptics.success();
    Animated.timing(fillAnim, {
      toValue: 1, duration: 1200, useNativeDriver: false,
    }).start(() => setJarFilled(true));
  };

  const handleSaveMemory = () => {
    if (!memoryType || (memoryType === 'text' && !memoryText) || (memoryType === 'emoji' && !selectedEmoji)) return;
    fillJar();
    setTimeout(() => setStep('compliment'), 1500);
  };

  const handleSaveCompliment = () => {
    if (!compliment) return;
    haptics.success();
    setStep('dropbox');
  };

  const handleDropboxDone = () => {
    haptics.success();
    completeDay(4, {
      memoryAdded: memoryType !== 'skip',
      memoryType,
      tinyComplimentWord: compliment,
      dropBoxUsed: !!dropText,
    });
    router.push('/home');
  };

  const jarHeight = fillAnim.interpolate({
    inputRange: [0, 1], outputRange: ['0%', '70%'],
  });

  // ─── DROP BOX STEP ───────────────────────────────────────────────────────────
  if (step === 'dropbox') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: COLORS.day4.bg }]}>
        <ProgressStrip currentDay={4} />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>The Drop Box</Text>
            <Text style={styles.sub}>
              Is there something you've been carrying that you haven't been able to say?{'\n'}
              Write it here. Only you will see it.
            </Text>
            <TextInput
              style={styles.dropInput}
              placeholder="Drop it here…"
              placeholderTextColor={COLORS.textMuted}
              multiline
              value={dropText}
              onChangeText={setDropText}
              textAlignVertical="top"
            />
            {dropText.length > 10 && (
              <View style={styles.reframeCard}>
                <Text style={styles.reframeLabel}>🪄 Reframed</Text>
                <Text style={styles.reframeText}>
                  What you're feeling is real. What would it look like to bring this as a curiosity instead of a charge?
                </Text>
              </View>
            )}
            <TouchableOpacity style={[styles.cta, { backgroundColor: COLORS.day4.text }]} onPress={handleDropboxDone}>
              <Text style={styles.ctaText}>I'm done for today →</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDropboxDone} style={styles.ghost}>
              <Text style={styles.ghostText}>Skip</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ─── COMPLIMENT STEP ─────────────────────────────────────────────────────────
  if (step === 'compliment') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: COLORS.day4.bg }]}>
        <ProgressStrip currentDay={4} />
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>One word.</Text>
          <Text style={styles.sub}>In one word — what is your partner being right now, for you?</Text>
          <View style={styles.pillGrid}>
            {COMPLIMENTS.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.pill, compliment === c && styles.pillActive]}
                onPress={() => { haptics.selection(); setCompliment(c); }}
              >
                <Text style={[styles.pillText, compliment === c && styles.pillTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={[styles.cta, !compliment && styles.ctaDisabled, { backgroundColor: COLORS.day4.text }]}
            disabled={!compliment}
            onPress={handleSaveCompliment}
          >
            <Text style={styles.ctaText}>Save this word →</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── JAR STEP ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.day4.bg }]}>
      <ProgressStrip currentDay={4} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>The Memory Jar</Text>
        <Text style={styles.sub}>Drop one memory here. A moment you never want to forget.</Text>

        {/* Jar visual */}
        <View style={styles.jar}>
          <Animated.View style={[styles.jarFill, { height: jarHeight }]}>
            {jarFilled && <Text style={styles.jarNote}>📝</Text>}
          </Animated.View>
          {!jarFilled && <Text style={styles.jarEmpty}>✨</Text>}
        </View>

        {/* Memory type selector */}
        <View style={styles.typeRow}>
          {MEMORY_TYPES.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={[styles.typeCard, memoryType === t.id && styles.typeCardActive]}
              onPress={() => { haptics.light(); setMemoryType(t.id); }}
            >
              <Text style={styles.typeEmoji}>{t.emoji}</Text>
              <Text style={styles.typeLabel}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {memoryType === 'text' && (
          <TextInput
            style={styles.input}
            placeholder="A moment you want to keep…"
            placeholderTextColor={COLORS.textMuted}
            multiline
            value={memoryText}
            onChangeText={setMemoryText}
            textAlignVertical="top"
          />
        )}

        {memoryType === 'emoji' && (
          <View style={styles.emojiGrid}>
            {EMOJIS.map((e) => (
              <TouchableOpacity
                key={e}
                style={[styles.emojiCard, selectedEmoji === e && styles.emojiCardActive]}
                onPress={() => { haptics.light(); setSelectedEmoji(e); }}
              >
                <Text style={styles.emojiItem}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {memoryType && (
          <TouchableOpacity style={[styles.cta, { backgroundColor: COLORS.day4.text }]} onPress={handleSaveMemory}>
            <Text style={styles.ctaText}>{memoryType === 'skip' ? 'Skip today' : 'Add to jar →'}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 28, paddingBottom: 60 },
  title: {
    fontSize: 32, fontFamily: 'PlayfairDisplay_700Bold',
    color: COLORS.day4.text, marginBottom: 8, marginTop: 8,
  },
  sub: {
    fontSize: 15, fontFamily: 'Inter_400Regular',
    color: COLORS.textSecondary, lineHeight: 22, marginBottom: 28,
  },
  jar: {
    width: 160, height: 200, alignSelf: 'center', marginBottom: 32,
    backgroundColor: '#fff', borderRadius: 20,
    borderWidth: 2, borderColor: COLORS.day4.accent,
    overflow: 'hidden', justifyContent: 'flex-end', alignItems: 'center',
  },
  jarFill: {
    width: '100%', backgroundColor: COLORS.day4.accent + '40',
    justifyContent: 'center', alignItems: 'center',
  },
  jarEmpty: { fontSize: 40, marginBottom: 20 },
  jarNote: { fontSize: 40 },
  typeRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  typeCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 16, paddingVertical: 16,
    alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.border,
  },
  typeCardActive: { borderColor: COLORS.day4.accent, backgroundColor: COLORS.day4.accent + '15' },
  typeEmoji: { fontSize: 28, marginBottom: 6 },
  typeLabel: { fontSize: 12, fontFamily: 'Inter_400Regular', color: COLORS.textSecondary },
  input: {
    backgroundColor: '#fff', borderRadius: 20, padding: 20, height: 140,
    fontSize: 15, fontFamily: 'Inter_400Regular', color: COLORS.text,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 24,
  },
  emojiGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24, justifyContent: 'center',
  },
  emojiCard: {
    width: 64, height: 64, borderRadius: 16,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  emojiCardActive: { borderColor: COLORS.day4.accent, backgroundColor: COLORS.day4.accent + '20' },
  emojiItem: { fontSize: 32 },
  pillGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 36 },
  pill: {
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: 100,
    backgroundColor: '#fff', borderWidth: 1.5, borderColor: COLORS.border,
  },
  pillActive: { borderColor: COLORS.day4.accent, backgroundColor: COLORS.day4.accent + '20' },
  pillText: { fontSize: 14, fontFamily: 'Inter_400Regular', color: COLORS.textSecondary },
  pillTextActive: { color: COLORS.day4.text, fontWeight: '700' },
  cta: {
    borderRadius: 100, paddingVertical: 18, alignItems: 'center', marginBottom: 12,
  },
  ctaDisabled: { opacity: 0.35 },
  ctaText: { color: '#fff', fontSize: 16, fontFamily: 'Inter_400Regular' },
  dropInput: {
    backgroundColor: '#fff', borderRadius: 20, padding: 20, height: 180,
    fontSize: 15, fontFamily: 'Inter_400Regular', color: COLORS.text,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 20,
  },
  reframeCard: {
    backgroundColor: COLORS.day4.accent + '15', borderRadius: 16, padding: 20,
    borderLeftWidth: 3, borderLeftColor: COLORS.day4.accent, marginBottom: 24,
  },
  reframeLabel: { fontSize: 12, fontFamily: 'Inter_400Regular', color: COLORS.day4.text, marginBottom: 6 },
  reframeText: { fontSize: 14, fontFamily: 'PlayfairDisplay_400Regular_Italic', color: COLORS.text, lineHeight: 22 },
  ghost: { alignItems: 'center', paddingVertical: 12 },
  ghostText: { fontSize: 13, fontFamily: 'Inter_400Regular', color: COLORS.textMuted },
});
