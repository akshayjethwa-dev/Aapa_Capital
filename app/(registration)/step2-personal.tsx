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
// IMPORT CENTRALIZED SCHEMAS
import { personalInfoSchema, addressSchema } from '../../utils/validation';

// Pick dob/pan from personalInfoSchema and merge it with the entire addressSchema
const schema = personalInfoSchema
  .pick({ dob: true, pan: true })
  .merge(addressSchema);

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

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.step}>Step 2 of 6</Text>
            <Text style={styles.title}>Personal Details</Text>
            <Text style={styles.subtitle}>
              Please provide your personal and address information
            </Text>
          </View>

          <View style={styles.form}>
            {/* 🚨 CRITICAL FIX: Conditionally render Date Picker for Mobile, Text Input for Web */}
            {Platform.OS === 'web' ? (
              <Controller
                control={control}
                name="dob"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Input
                    label="Date of Birth (YYYY-MM-DD)"
                    placeholder="e.g. 1990-01-25"
                    value={value}
                    onChangeText={onChange}
                    error={error?.message}
                    maxLength={10}
                  />
                )}
              />
            ) : (
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
                    <>{error ? <Text style={styles.errorText}>{error.message}</Text> : null}</>
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
            )}

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
  container: { flex: 1, backgroundColor: Colors.light.background },
  keyboardView: { flex: 1 },
  headerContainer: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  backButton: { marginBottom: Spacing.md },
  scrollContent: { flexGrow: 1, padding: Spacing.lg },
  header: { marginBottom: Spacing.xl },
  step: { fontSize: FontSizes.sm, color: Colors.light.primary, fontWeight: '600', marginBottom: Spacing.xs },
  title: { fontSize: FontSizes.xxl, fontWeight: 'bold', color: Colors.light.text, marginBottom: Spacing.sm },
  subtitle: { fontSize: FontSizes.md, color: Colors.light.textSecondary },
  form: { gap: Spacing.md },
  label: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.light.text, marginBottom: Spacing.xs },
  dateButton: { borderWidth: 1, borderColor: Colors.light.border, borderRadius: 8, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm + 4, backgroundColor: Colors.light.background, minHeight: 48, justifyContent: 'center' },
  dateText: { fontSize: FontSizes.md, color: Colors.light.text },
  placeholderText: { color: Colors.light.textSecondary },
  textAreaContainer: { minHeight: 80 },
  errorText: { fontSize: FontSizes.xs, color: Colors.light.error, marginTop: Spacing.xs },
  button: { marginTop: Spacing.lg },
});