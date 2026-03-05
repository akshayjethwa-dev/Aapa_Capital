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
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';
import { useFormStore } from '../../hooks/useFormStore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ChevronLeft } from 'lucide-react-native';
import { formatDate } from '../../utils/helpers';

const schema = z.object({
  dob: z.string().min(1, 'Date of birth is required'),
  pan: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format (e.g., ABCDE1234F)')
    .length(10, 'PAN must be 10 characters'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
});

type FormData = z.infer<typeof schema>;

export default function Step2PersonalScreen() {
  const { formData, setFormData } = useFormStore();
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const { control, handleSubmit, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      dob: formData.dob || '',
      pan: formData.pan || '',
      address: formData.address || '',
      city: formData.city || '',
      state: formData.state || '',
      pincode: formData.pincode || '',
    },
  });

  const dobValue = watch('dob');

  const onDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
      setValue('dob', formatDate(date));
    }
  };

  const onSubmit = (data: FormData) => {
    setFormData(data);
    router.push('/(registration)/step3-professional');
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
          <ProgressBar currentStep={2} totalSteps={6} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.step}>Step 2 of 6</Text>
            <Text style={styles.title}>Personal Details</Text>
            <Text style={styles.subtitle}>
              Please provide your personal and address information
            </Text>
          </View>

          <View style={styles.form}>
            {/* Date of Birth */}
            <View>
              <Text style={styles.label}>Date of Birth</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text
                  style={[
                    styles.dateText,
                    !dobValue && styles.placeholderText,
                  ]}
                >
                  {dobValue || 'Select date of birth'}
                </Text>
              </TouchableOpacity>
              <Controller
                control={control}
                name="dob"
                render={({ fieldState: { error } }) => (
                  error ? <Text style={styles.errorText}>{error.message}</Text> : null
                )}
              />

              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(1950, 0, 1)}
                />
              )}
            </View>

            {/* PAN */}
            <Controller
              control={control}
              name="pan"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Input
                  label="PAN Number"
                  placeholder="ABCDE1234F"
                  autoCapitalize="characters"
                  maxLength={10}
                  value={value}
                  onChangeText={(text) => onChange(text.toUpperCase())}
                  error={error?.message}
                />
              )}
            />

            {/* Address */}
            <Controller
              control={control}
              name="address"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <View>
                  <Text style={styles.label}>Address</Text>
                  <Input
                    placeholder="Enter complete address"
                    multiline
                    numberOfLines={3}
                    value={value}
                    onChangeText={onChange}
                    error={error?.message}
                    containerStyle={styles.textAreaContainer}
                  />
                </View>
              )}
            />

            {/* City */}
            <Controller
              control={control}
              name="city"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Input
                  label="City"
                  placeholder="Enter city"
                  value={value}
                  onChangeText={onChange}
                  error={error?.message}
                />
              )}
            />

            {/* State */}
            <Controller
              control={control}
              name="state"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Input
                  label="State"
                  placeholder="Enter state"
                  value={value}
                  onChangeText={onChange}
                  error={error?.message}
                />
              )}
            />

            {/* Pincode */}
            <Controller
              control={control}
              name="pincode"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Input
                  label="Pincode"
                  placeholder="Enter 6-digit pincode"
                  keyboardType="number-pad"
                  maxLength={6}
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
    gap: Spacing.md,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    backgroundColor: Colors.light.background,
    minHeight: 48,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: FontSizes.md,
    color: Colors.light.text,
  },
  placeholderText: {
    color: Colors.light.textSecondary,
  },
  textAreaContainer: {
    minHeight: 80,
  },
  errorText: {
    fontSize: FontSizes.xs,
    color: Colors.light.error,
    marginTop: Spacing.xs,
  },
  button: {
    marginTop: Spacing.lg,
  },
});
