import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/Colors';
import { useFormStore } from '../../hooks/useFormStore';
import { ChevronLeft } from 'lucide-react-native';

const schema = z.object({
  riskProfile: z.string().min(1, 'Risk profile is required'),
});

type FormData = z.infer<typeof schema>;

const riskProfiles = [
  {
    value: 'conservative',
    label: 'Conservative',
    description: 'Low risk, stable returns',
    icon: '🛡️',
    color: '#10B981',
    characteristics: [
      'Preserve capital',
      'Minimal volatility',
      'Fixed income focus',
    ],
  },
  {
    value: 'moderate',
    label: 'Moderate',
    description: 'Balanced risk & returns',
    icon: '⚖️',
    color: '#F59E0B',
    characteristics: [
      'Balanced approach',
      'Mix of equity & debt',
      'Moderate growth',
    ],
  },
  {
    value: 'aggressive',
    label: 'Aggressive',
    description: 'High risk, high returns',
    icon: '🚀',
    color: '#EF4444',
    characteristics: [
      'Maximum growth',
      'High volatility tolerance',
      'Equity focused',
    ],
  },
];

export default function Step5RiskScreen() {
  const router = useRouter();
  const { formData, setFormData } = useFormStore();

  const { control, handleSubmit, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      riskProfile: formData.riskProfile || '',
    },
  });

  const selectedRisk = watch('riskProfile');

  const onSubmit = (data: FormData) => {
    setFormData(data);
    router.push('/(registration)/step6-review');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ChevronLeft color={Colors.light.text} size={24} />
          </TouchableOpacity>
          <ProgressBar currentStep={5} totalSteps={6} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.step}>Step 5 of 6</Text>
            <Text style={styles.title}>Risk Profile</Text>
            <Text style={styles.subtitle}>
              Choose your investment risk tolerance
            </Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="riskProfile"
              render={({ fieldState: { error } }) => (
                <>
                  <View style={styles.optionsContainer}>
                    {riskProfiles.map((profile) => (
                      <TouchableOpacity
                        key={profile.value}
                        style={[
                          styles.profileCard,
                          selectedRisk === profile.value &&
                            styles.profileCardSelected,
                        ]}
                        onPress={() => setValue('riskProfile', profile.value)}
                      >
                        <View style={styles.profileHeader}>
                          <Text style={styles.profileIcon}>{profile.icon}</Text>
                          <View style={styles.profileTitleContainer}>
                            <Text
                              style={[
                                styles.profileLabel,
                                selectedRisk === profile.value &&
                                  styles.profileLabelSelected,
                              ]}
                            >
                              {profile.label}
                            </Text>
                            <Text style={styles.profileDescription}>
                              {profile.description}
                            </Text>
                          </View>
                          {selectedRisk === profile.value && (
                            <View
                              style={[
                                styles.checkmark,
                                { backgroundColor: profile.color },
                              ]}
                            >
                              <Text style={styles.checkmarkText}>✓</Text>
                            </View>
                          )}
                        </View>

                        <View style={styles.characteristicsContainer}>
                          {profile.characteristics.map((char, index) => (
                            <View key={index} style={styles.characteristicItem}>
                              <Text style={styles.bullet}>•</Text>
                              <Text style={styles.characteristicText}>
                                {char}
                              </Text>
                            </View>
                          ))}
                        </View>

                        {selectedRisk === profile.value && (
                          <View
                            style={[
                              styles.selectedBorder,
                              { backgroundColor: profile.color },
                            ]}
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                  {error && (
                    <Text style={styles.errorText}>{error.message}</Text>
                  )}
                </>
              )}
            />

            {/* Info Card */}
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>💡</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Important Note</Text>
                <Text style={styles.infoText}>
                  Your risk profile helps us recommend suitable investment
                  products. You can always change this later.
                </Text>
              </View>
            </View>

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
  headerContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  backButton: {
    marginBottom: Spacing.md,
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
    gap: Spacing.xl,
  },
  optionsContainer: {
    gap: Spacing.md,
  },
  profileCard: {
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.light.background,
    position: 'relative',
    overflow: 'hidden',
  },
  profileCardSelected: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.surface,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  profileIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  profileTitleContainer: {
    flex: 1,
  },
  profileLabel: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 2,
  },
  profileLabelSelected: {
    color: Colors.light.primary,
  },
  profileDescription: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
  },
  characteristicsContainer: {
    gap: Spacing.xs,
  },
  characteristicItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: FontSizes.md,
    color: Colors.light.primary,
    marginRight: Spacing.xs,
    marginTop: 2,
  },
  characteristicText: {
    fontSize: FontSizes.sm,
    color: Colors.light.text,
    flex: 1,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
  },
  selectedBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  infoText: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  errorText: {
    fontSize: FontSizes.xs,
    color: Colors.light.error,
    marginTop: Spacing.xs,
  },
  button: {
    marginTop: Spacing.md,
  },
});
