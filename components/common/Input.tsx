import React, { forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes } from '../../constants/Colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, containerStyle, ...props }, ref) => {
    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TextInput
          ref={ref}
          style={[styles.input, error && styles.inputError]}
          placeholderTextColor={Colors.light.textSecondary}
          {...props}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSizes.md,
    color: Colors.light.text,
    backgroundColor: Colors.light.background,
    minHeight: 48,
  },
  inputError: {
    borderColor: Colors.light.error,
  },
  errorText: {
    fontSize: FontSizes.xs,
    color: Colors.light.error,
    marginTop: Spacing.xs,
  },
});
