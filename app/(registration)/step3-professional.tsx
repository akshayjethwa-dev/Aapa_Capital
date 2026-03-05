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
import { ChevronLeft, ChevronDown } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';

const schema = z.object({
  occupation: z.string().min(1, 'Occupation is required'),
  income: z.string().min(1, 'Annual income is required'),
});

type FormData = z.infer<typeof schema>;

const occupations = [
  { label: 'Select Occupation', value: '' },
  { label: 'Salaried', value: 'salaried' },
  { label: 'Self Employed - Business', value: 'business' },
  { label: 'Self Employed - Professional', value: 'professional' },
  { label: 'Retired', value: 'retired' },
  { label: 'Student', value: 'student' },
  { label: 'Homemaker', value: 'homemaker' },
  { label: 'Others', value: 'others' },
];

const incomeRanges = [
  { label: 'Select Annual Income', value: '' },
  { label: 'Below ₹1 Lakh', value: 'below_1l' },
  { label: '₹1-5 Lakhs', value: '1l_5l' },
  { label: '₹5-10 Lakhs', value: '5l_10l' },
  { label: '₹10-25 Lakhs', value: '10l_25l' },
  { label: '₹25-50 Lakhs', value: '25l_50l' },
  { label: '₹50 Lakhs - 1 Crore', value: '50l_1cr' },
  { label: 'Above ₹1 Crore', value: 'above_1cr' },
];

export default function Step3ProfessionalScreen() {
  const router = useRouter();
  const { formData, setFormData } = useFormStore();

  const { control, handleSubmit, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      occupation: formData.occupation || '',
      income: formData.income || '',
    },
  });

  const occupation = watch('occupation');
  const income = watch('income');

  const onSubmit = (data: FormData) => {
    setFormData(data);
    router.push('/(registration)/step4-investment');
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
          <ProgressBar currentStep={3} totalSteps={6} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.step}>Step 3 of 6</Text>
            <Text style={styles.title}>Professional Details</Text>
            <Text style={styles.subtitle}>
              Tell us about your occupation and income
            </Text>
          </View>

          <View style={styles.form}>
            {/* Occupation */}
            <View>
              <Text style={styles.label}>Occupation</Text>
              <Controller
                control={control}
                name="occupation"
                render={({ fieldState: { error } }) => (
                  <>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={occupation}
                        onValueChange={(value) => setValue('occupation', value)}
                        style={styles.picker}
                      >
                        {occupations.map((item) => (
                          <Picker.Item
                            key={item.value}
                            label={item.label}
                            value={item.value}
                          />
                        ))}
                      </Picker>
                    </View>
                    {error && (
                      <Text style={styles.errorText}>{error.message}</Text>
                    )}
                  </>
                )}
              />
            </View>

            {/* Annual Income */}
            <View>
              <Text style={styles.label}>Annual Income</Text>
              <Controller
                control={control}
                name="income"
                render={({ fieldState: { error } }) => (
                  <>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={income}
                        onValueChange={(value) => setValue('income', value)}
                        style={styles.picker}
                      >
                        {incomeRanges.map((item) => (
                          <Picker.Item
                            key={item.value}
                            label={item.label}
                            value={item.value}
                          />
                        ))}
                      </Picker>
                    </View>
                    {error && (
                      <Text style={styles.errorText}>{error.message}</Text>
                    )}
                  </>
                )}
              />
            </View>

            {/* Info Card */}
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>💼</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Why we need this?</Text>
                <Text style={styles.infoText}>
                  This information helps us understand your financial profile and
                  recommend suitable investment options.
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
    gap: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.background,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  errorText: {
    fontSize: FontSizes.xs,
    color: Colors.light.error,
    marginTop: Spacing.xs,
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
  button: {
    marginTop: Spacing.md,
  },
});
