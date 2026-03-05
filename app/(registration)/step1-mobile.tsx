import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';
import { useFormStore } from '../../hooks/useFormStore';
// IMPORT CENTRALIZED SCHEMA
import { personalInfoSchema } from '../../utils/validation';

// Pick only the fields needed for Step 1 from the central schema
const schema = personalInfoSchema.pick({
  name: true,
  email: true,
});

type FormData = z.infer<typeof schema>;

export default function Step1MobileScreen() {
  const router = useRouter();
  const { formData, setFormData } = useFormStore();

  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: formData.name || '',
      email: formData.email || '',
    },
  });

  const onSubmit = (data: FormData) => {
    setFormData(data);
    router.push('/(registration)/step2-personal');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.step}>Step 1 of 6</Text>
            <Text style={styles.title}>Basic Information</Text>
            <Text style={styles.subtitle}>
              Please provide your name and email address
            </Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={value}
                  onChangeText={onChange}
                  error={error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Input
                  label="Email Address"
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  error={error?.message}
                />
              )}
            />

            <Button
              title="Continue"
              onPress={handleSubmit(onSubmit)}
              style={styles.button}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  step: {
    fontSize: FontSizes.sm,
    color: Colors.light.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.light.textSecondary,
  },
  form: {
    gap: Spacing.md,
  },
  button: {
    marginTop: Spacing.lg,
  },
});