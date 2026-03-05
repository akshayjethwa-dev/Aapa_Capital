import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/Colors';
import { useFormStore } from '../../hooks/useFormStore';
import { ChevronLeft, Edit2 } from 'lucide-react-native';
import { ref, set } from 'firebase/database';
import { database } from '../../config/firebase';
import Toast from 'react-native-toast-message';

export default function Step6ReviewScreen() {
  const { formData, user, setUser } = useFormStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Save to Firebase Realtime Database
      const userRef = ref(database, `users/${user.uid}`);
      const completeFormData = {
        mobile: formData.mobile || '',
        name: formData.name || '',
        email: formData.email || '',
        dob: formData.dob || '',
        pan: formData.pan || '',
        address: formData.address || '',
        city: formData.city || '',
        state: formData.state || '',
        pincode: formData.pincode || '',
        occupation: formData.occupation || '',
        income: formData.income || '',
        investmentExperience: formData.investmentExperience || '',
        investmentGoal: formData.investmentGoal || '',
        riskProfile: formData.riskProfile || '',
      };

      await set(userRef, {
        ...user,
        formData: completeFormData,
        registrationComplete: true,
        updatedAt: Date.now(),
      });

      // Update local state
      setUser({
        ...user,
        formData: completeFormData,
        registrationComplete: true,
      });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Registration completed successfully',
      });

      router.replace('/success');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to submit registration',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (step: string) => {
    router.push(step);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft color={Colors.light.text} size={24} />
        </TouchableOpacity>
        <ProgressBar currentStep={6} totalSteps={6} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.step}>Step 6 of 6</Text>
          <Text style={styles.title}>Review & Submit</Text>
          <Text style={styles.subtitle}>
            Please review your information before submitting
          </Text>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            <TouchableOpacity
              onPress={() => handleEdit('/(registration)/step1-mobile')}
            >
              <Edit2 color={Colors.light.primary} size={20} />
            </TouchableOpacity>
          </View>
          <ReviewItem label="Name" value={formData.name} />
          <ReviewItem label="Email" value={formData.email} />
          <ReviewItem label="Mobile" value={formData.mobile} />
        </View>

        {/* Personal Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Details</Text>
            <TouchableOpacity
              onPress={() => handleEdit('/(registration)/step2-personal')}
            >
              <Edit2 color={Colors.light.primary} size={20} />
            </TouchableOpacity>
          </View>
          <ReviewItem label="Date of Birth" value={formData.dob} />
          <ReviewItem label="PAN" value={formData.pan} />
          <ReviewItem label="Address" value={formData.address} />
          <ReviewItem label="City" value={formData.city} />
          <ReviewItem label="State" value={formData.state} />
          <ReviewItem label="Pincode" value={formData.pincode} />
        </View>

        {/* Professional Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Professional Details</Text>
            <TouchableOpacity
              onPress={() => handleEdit('/(registration)/step3-professional')}
            >
              <Edit2 color={Colors.light.primary} size={20} />
            </TouchableOpacity>
          </View>
          <ReviewItem label="Occupation" value={formData.occupation} />
          <ReviewItem label="Annual Income" value={formData.income} />
        </View>

        {/* Investment Profile */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Investment Profile</Text>
            <TouchableOpacity
              onPress={() => handleEdit('/(registration)/step4-investment')}
            >
              <Edit2 color={Colors.light.primary} size={20} />
            </TouchableOpacity>
          </View>
          <ReviewItem
            label="Experience"
            value={formData.investmentExperience}
          />
          <ReviewItem label="Goal" value={formData.investmentGoal} />
          <ReviewItem label="Risk Profile" value={formData.riskProfile} />
        </View>

        {/* Terms & Conditions */}
        <View style={styles.termsCard}>
          <Text style={styles.termsTitle}>Terms & Conditions</Text>
          <Text style={styles.termsText}>
            By submitting this form, you agree to Aapa Capital's Terms of Service
            and Privacy Policy. You confirm that all information provided is
            accurate and complete.
          </Text>
        </View>

        <Button
          title="Submit Application"
          onPress={handleSubmit}
          loading={loading}
          style={styles.button}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const ReviewItem: React.FC<{ label: string; value?: string }> = ({
  label,
  value,
}) => (
  <View style={styles.reviewItem}>
    <Text style={styles.reviewLabel}>{label}</Text>
    <Text style={styles.reviewValue}>{value || 'N/A'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
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
  section: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.light.text,
  },
  reviewItem: {
    marginBottom: Spacing.sm,
  },
  reviewLabel: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  reviewValue: {
    fontSize: FontSizes.md,
    color: Colors.light.text,
    fontWeight: '500',
  },
  termsCard: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.warning,
  },
  termsTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  termsText: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  button: {
    marginBottom: Spacing.lg,
  },
});
