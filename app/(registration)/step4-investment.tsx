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
  investmentExperience: z.string().min(1, 'Investment experience is required'),
  investmentGoal: z.string().min(1, 'Investment goal is required'),
});

type FormData = z.infer<typeof schema>;

const experiences = [
  {
    value: 'beginner',
    label: 'Beginner',
    description: 'New to investing',
    icon: '🌱',
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    description: '1-3 years experience',
    icon: '📈',
  },
  {
    value: 'advanced',
    label: 'Advanced',
    description: '3+ years experience',
    icon: '🚀',
  },
];

const goals = [
  {
    value: 'wealth_creation',
    label: 'Wealth Creation',
    description: 'Long-term growth',
    icon: '💰',
  },
  {
    value: 'retirement',
    label: 'Retirement',
    description: 'Save for retirement',
    icon: '🏖️',
  },
  {
    value: 'income',
    label: 'Regular Income',
    description: 'Generate steady income',
    icon: '💵',
  },
  {
    value: 'short_term',
    label: 'Short Term',
    description: '1-3 years goal',
    icon: '🎯',
  },
];

export default function Step4InvestmentScreen() {
  const router = useRouter();
  const { formData, setFormData } = useFormStore();

  const { control, handleSubmit, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      investmentExperience: formData.investmentExperience || '',
      investmentGoal: formData.investmentGoal || '',
    },
  });

  const selectedExperience = watch('investmentExperience');
  const selectedGoal = watch('investmentGoal');

  const onSubmit = (data: FormData) => {
    setFormData(data);
    router.push('/(registration)/step5-risk');
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
          <ProgressBar currentStep={4} totalSteps={6} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.step}>Step 4 of 6</Text>
            <Text style={styles.title}>Investment Profile</Text>
            <Text style={styles.subtitle}>
              Help us understand your investment preferences
            </Text>
          </View>

          <View style={styles.form}>
            {/* Investment Experience */}
            <View>
              <Text style={styles.sectionTitle}>Investment Experience</Text>
              <Controller
                control={control}
                name="investmentExperience"
                render={({ fieldState: { error } }) => (
                  <>
                    <View style={styles.optionsContainer}>
                      {experiences.map((exp) => (
                        <TouchableOpacity
                          key={exp.value}
                          style={[
                            styles.optionCard,
                            selectedExperience === exp.value &&
                              styles.optionCardSelected,
                          ]}
                          onPress={() => setValue('investmentExperience', exp.value)}
                        >
                          <Text style={styles.optionIcon}>{exp.icon}</Text>
                          <View style={styles.optionContent}>
                            <Text
                              style={[
                                styles.optionLabel,
                                selectedExperience === exp.value &&
                                  styles.optionLabelSelected,
                              ]}
                            >
                              {exp.label}
                            </Text>
                            <Text style={styles.optionDescription}>
                              {exp.description}
                            </Text>
                          </View>
                          {selectedExperience === exp.value && (
                            <View style={styles.checkmark}>
                              <Text style={styles.checkmarkText}>✓</Text>
                            </View>
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
            </View>

            {/* Investment Goal */}
            <View>
              <Text style={styles.sectionTitle}>Investment Goal</Text>
              <Controller
                control={control}
                name="investmentGoal"
                render={({ fieldState: { error } }) => (
                  <>
                    <View style={styles.optionsContainer}>
                      {goals.map((goal) => (
                        <TouchableOpacity
                          key={goal.value}
                          style={[
                            styles.optionCard,
                            selectedGoal === goal.value &&
                              styles.optionCardSelected,
                          ]}
                          onPress={() => setValue('investmentGoal', goal.value)}
                        >
                          <Text style={styles.optionIcon}>{goal.icon}</Text>
                          <View style={styles.optionContent}>
                            <Text
                              style={[
                                styles.optionLabel,
                                selectedGoal === goal.value &&
                                  styles.optionLabelSelected,
                              ]}
                            >
                              {goal.label}
                            </Text>
                            <Text style={styles.optionDescription}>
                              {goal.description}
                            </Text>
                          </View>
                          {selectedGoal === goal.value && (
                            <View style={styles.checkmark}>
                              <Text style={styles.checkmarkText}>✓</Text>
                            </View>
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
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  optionsContainer: {
    gap: Spacing.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.light.background,
  },
  optionCardSelected: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.surface,
  },
  optionIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 2,
  },
  optionLabelSelected: {
    color: Colors.light.primary,
  },
  optionDescription: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
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
