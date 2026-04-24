import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../theme/colors';
import { ProgressStrip } from '../../components/common/ProgressStrip';
import { Camera } from 'lucide-react-native';

export default function Day3AppreciationSnap() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ProgressStrip currentDay={3} />
      <View style={styles.content}>
        <Text style={styles.title}>The Appreciation Snap</Text>
        <Text style={styles.sub}>Take a photo of something your partner did or something that reminds you of them today.</Text>
        
        <View style={styles.cameraPlaceholder}>
          <Camera size={48} color={COLORS.day3.accent} />
          <Text style={styles.placeholderText}>Tap to open camera</Text>
        </View>

        <TouchableOpacity 
          style={[styles.cta, { backgroundColor: COLORS.day3.text }]}
          onPress={() => router.push('/day3')}
        >
          <Text style={styles.ctaText}>I've got it →</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.push('/day3')} style={styles.ghost}>
          <Text style={styles.ghostText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.day3.bg },
  content: { flex: 1, paddingHorizontal: 32, justifyContent: 'center' },
  title: { fontSize: 32, fontFamily: 'PlayfairDisplay_700Bold', color: COLORS.day3.text, marginBottom: 12 },
  sub: { fontSize: 16, fontFamily: 'Inter_400Regular', color: COLORS.textSecondary, lineHeight: 24, marginBottom: 40 },
  cameraPlaceholder: {
    height: 240, backgroundColor: '#fff', borderRadius: 24,
    justifyContent: 'center', alignItems: 'center', marginBottom: 40,
    borderWidth: 2, borderColor: COLORS.day3.accent + '30', borderStyle: 'dashed'
  },
  placeholderText: { marginTop: 12, fontSize: 14, fontFamily: 'Inter_400Regular', color: COLORS.day3.accent },
  cta: { borderRadius: 100, paddingVertical: 18, alignItems: 'center', marginBottom: 12 },
  ctaText: { color: '#fff', fontSize: 16, fontFamily: 'Inter_400Regular' },
  ghost: { alignItems: 'center', paddingVertical: 12 },
  ghostText: { fontSize: 13, fontFamily: 'Inter_400Regular', color: COLORS.textMuted },
});
