import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

interface Props {
  totalDays?: number;
  currentDay: number;
}

export function ProgressStrip({ totalDays = 5, currentDay }: Props) {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalDays }).map((_, i) => {
        const day = i + 1;
        const isActive = day === currentDay;
        const isDone = day < currentDay;
        return (
          <View key={i} style={styles.pipWrap}>
            <View
              style={[
                styles.pip,
                isActive && styles.pipActive,
                isDone && styles.pipDone,
              ]}
            />
            {isActive && <Text style={styles.label}>Day {day}</Text>}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  pipWrap: {
    alignItems: 'center',
  },
  pip: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  pipActive: {
    width: 32,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.teal,
  },
  pipDone: {
    backgroundColor: COLORS.teal,
    opacity: 0.4,
  },
  label: {
    fontSize: 9,
    color: COLORS.teal,
    marginTop: 4,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
