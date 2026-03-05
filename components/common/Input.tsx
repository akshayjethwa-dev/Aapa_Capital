import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  rightIcon, 
  onRightIconPress, 
  style, 
  ...props 
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Colors.light.textSecondary}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.iconContainer}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: FontSizes.sm,
    color: Colors.light.text,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    minHeight: 52,
  },
  inputError: {
    borderColor: Colors.light.error,
  },
  input: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.light.text,
    height: '100%',
  },
  iconContainer: {
    paddingHorizontal: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  errorText: {
    color: Colors.light.error,
    fontSize: FontSizes.xs,
    marginTop: Spacing.xs,
  },
});