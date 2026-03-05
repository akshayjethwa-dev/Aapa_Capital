import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/Colors';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        <View style={styles.barBackground}>
          <View style={[styles.barFill, { width: `${progress}%` }]} />
        </View>
      </View>
      <Text style={styles.text}>
        {currentStep} of {totalSteps}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  barContainer: {
    marginBottom: Spacing.xs,
  },
  barBackground: {
    height: 8,
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.full,
  },
  text: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    textAlign: 'right',
  },
});
