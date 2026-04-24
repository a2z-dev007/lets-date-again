import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../theme/colors';
import { useUserStore } from '../../store/useUserStore';
import { haptics } from '../../utils/haptics';

export default function Day5TheLetter() {
  const navigation = useNavigation<any>();
  const name = useUserStore(s => s.name);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 2000, useNativeDriver: true }).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.salutation}>Dear {name},</Text>
          <Text style={styles.body}>
            Five days in. You didn't know what you'd find — but you showed up anyway. {"\n\n"}
            The intention you set on Day 1 was the start of something. The memory you chose to keep is the proof. {"\n\n"}
            This isn't just about a week of answers. It's about a choice you're making every day to be the one who tries. That's who you are.
          </Text>
          <Text style={styles.closing}>With intention,</Text>
          <Text style={styles.signoff}>LDA</Text>
        </Animated.View>

        <TouchableOpacity 
          style={[styles.cta, { backgroundColor: COLORS.day5.text }]}
          onPress={() => navigation.navigate('Day5')}
        >
          <Text style={styles.ctaText}>Finish your story →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.day5.bg },
  content: { flex: 1, paddingHorizontal: 40, justifyContent: 'center' },
  salutation: { fontSize: 24, fontFamily: 'PlayfairDisplay_700Bold', color: COLORS.day5.text, marginBottom: 24 },
  body: { fontSize: 18, fontFamily: 'PlayfairDisplay_400Regular_Italic', color: COLORS.text, lineHeight: 32, marginBottom: 40 },
  closing: { fontSize: 16, fontFamily: 'Inter_400Regular', color: COLORS.textSecondary },
  signoff: { fontSize: 20, fontFamily: 'PlayfairDisplay_700Bold', color: COLORS.day5.text, marginTop: 4 },
  cta: { borderRadius: 100, paddingVertical: 18, alignItems: 'center', marginTop: 60 },
  ctaText: { color: '#fff', fontSize: 16, fontFamily: 'Inter_400Regular' },
});
