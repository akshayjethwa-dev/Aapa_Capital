import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { auth, database } from '../config/firebase';
import { ref, update } from 'firebase/database';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Colors, Spacing, FontSizes, BorderRadius } from '../constants/Colors';
import Toast from 'react-native-toast-message';
import { ChevronLeft, CheckCircle2 } from 'lucide-react-native';

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form Data State
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    pan: '',
    income: '',
    experience: '',
  });

  const updateData = (key: string, value: string) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleNext = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.dob || !formData.pan) {
        return Toast.show({ type: 'error', text1: 'Incomplete', text2: 'Please fill all personal details' });
      }
      // Simple PAN Regex validation
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan.toUpperCase())) {
        return Toast.show({ type: 'error', text1: 'Invalid PAN', text2: 'Please enter a valid format (e.g., ABCDE1234F)' });
      }
    }
    if (step === 2 && !formData.income) {
      return Toast.show({ type: 'error', text1: 'Selection Required', text2: 'Please select your annual income' });
    }
    setStep(prev => prev + 1);
  };

  const handleComplete = async () => {
    if (!formData.experience) {
      return Toast.show({ type: 'error', text1: 'Selection Required', text2: 'Please select your trading experience' });
    }

    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      setLoading(true);
      // Update the user's waitlist profile with this new data
      await update(ref(database, `users/${currentUser.uid}`), {
        ...formData,
        pan: formData.pan.toUpperCase(),
        onboardingComplete: true,
      });
      
      Toast.show({ type: 'success', text1: 'Profile Completed!', text2: 'Welcome to the Aapa Capital waitlist.' });
      router.replace('/dashboard');
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: error.message });
    } finally {
      setLoading(false);
    }
  };

  const renderSelectionCards = (options: string[], selectedValue: string, key: string) => (
    <View style={styles.optionsContainer}>
      {options.map((option) => (
        <TouchableOpacity 
          key={option} 
          style={[styles.optionCard, selectedValue === option && styles.optionCardSelected]}
          onPress={() => updateData(key, option)}
        >
          <Text style={[styles.optionText, selectedValue === option && styles.optionTextSelected]}>{option}</Text>
          {selectedValue === option && <CheckCircle2 color={Colors.light.primary} size={20} />}
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        
        {/* Header */}
        <View style={styles.header}>
          {step > 1 ? (
            <TouchableOpacity onPress={() => setStep(prev => prev - 1)} style={styles.backButton}>
              <ChevronLeft color={Colors.light.text} size={28} />
            </TouchableOpacity>
          ) : <View style={{ width: 28 }} />}
          <Text style={styles.headerTitle}>Step {step} of 3</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${(step / 3) * 100}%` }]} />
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          
          {step === 1 && (
            <View style={styles.stepContainer}>
              <Text style={styles.title}>Personal Details</Text>
              <Text style={styles.subtitle}>We need this to secure your spot for a trading account.</Text>
              
              <View style={styles.formSpace}>
                <Input label="Full Name (As per PAN)" placeholder="e.g. Rahul Sharma" value={formData.fullName} onChangeText={(t) => updateData('fullName', t)} />
                <Input label="Date of Birth" placeholder="DD/MM/YYYY" keyboardType="numbers-and-punctuation" maxLength={10} value={formData.dob} onChangeText={(t) => updateData('dob', t)} />
                <Input label="PAN Card Number" placeholder="e.g. ABCDE1234F" autoCapitalize="characters" maxLength={10} value={formData.pan} onChangeText={(t) => updateData('pan', t)} />
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepContainer}>
              <Text style={styles.title}>Financial Profile</Text>
              <Text style={styles.subtitle}>Help us tailor the best trading limits for you.</Text>
              <Text style={styles.label}>Annual Income</Text>
              {renderSelectionCards(['Below 1 Lakh', '1 Lakh - 5 Lakhs', '5 Lakhs - 10 Lakhs', '10 Lakhs+'], formData.income, 'income')}
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepContainer}>
              <Text style={styles.title}>Trading Experience</Text>
              <Text style={styles.subtitle}>How long have you been trading in the markets?</Text>
              <Text style={styles.label}>Experience Level</Text>
              {renderSelectionCards(['Beginner (No experience)', 'Intermediate (1-3 years)', 'Pro Trader (3+ years)'], formData.experience, 'experience')}
            </View>
          )}

        </ScrollView>

        <View style={styles.footer}>
          {step < 3 ? (
            <Button title="Continue" onPress={handleNext} />
          ) : (
            <Button title="Complete Profile" onPress={handleComplete} loading={loading} />
          )}
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  backButton: { padding: Spacing.xs },
  headerTitle: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.light.textSecondary },
  progressContainer: { height: 4, backgroundColor: Colors.light.border, width: '100%' },
  progressBar: { height: '100%', backgroundColor: Colors.light.primary },
  content: { padding: Spacing.lg, flexGrow: 1 },
  stepContainer: { flex: 1 },
  title: { fontSize: 28, fontWeight: '900', color: Colors.light.text, marginBottom: Spacing.xs },
  subtitle: { fontSize: FontSizes.md, color: Colors.light.textSecondary, marginBottom: Spacing.xl },
  formSpace: { gap: Spacing.md },
  label: { fontSize: FontSizes.sm, color: Colors.light.text, fontWeight: '600', marginBottom: Spacing.md, textTransform: 'uppercase', letterSpacing: 1 },
  optionsContainer: { gap: Spacing.md },
  optionCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg, backgroundColor: Colors.light.surface, borderWidth: 2, borderColor: Colors.light.border, borderRadius: BorderRadius.lg },
  optionCardSelected: { borderColor: Colors.light.primary, backgroundColor: `${Colors.light.primary}08` },
  optionText: { fontSize: FontSizes.md, color: Colors.light.textSecondary, fontWeight: '600' },
  optionTextSelected: { color: Colors.light.primary, fontWeight: '800' },
  footer: { padding: Spacing.lg, borderTopWidth: 1, borderTopColor: Colors.light.border, backgroundColor: Colors.light.background },
});