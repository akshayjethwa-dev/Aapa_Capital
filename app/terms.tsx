import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '../constants/Colors';

export default function TermsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color={Colors.light.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.lastUpdated}>Last Updated: March 5, 2026</Text>

        <Section title="1. Introduction">
          <Text style={styles.paragraph}>
            Welcome to Aapa Capital. These Terms and Conditions govern your access to and use of the Aapa Capital mobile application. By using our App, you agree to be bound by these Terms.
          </Text>
          <Text style={styles.important}>
            IMPORTANT: This is a pre-registration application. Full trading and investment services are not yet available.
          </Text>
        </Section>

        <Section title="2. Eligibility">
          <BulletPoint text="You must be at least 18 years of age" />
          <BulletPoint text="You must be a resident of India" />
          <BulletPoint text="You must provide accurate information during registration" />
        </Section>

        <Section title="3. Pre-Registration Services">
          <Text style={styles.paragraph}>
            The App is currently in pre-registration phase. No trading or investment services are available at this time. We collect information solely for early registration purposes.
          </Text>
        </Section>

        <Section title="4. User Responsibilities">
          <Text style={styles.subheading}>You agree to:</Text>
          <BulletPoint text="Provide accurate and truthful information" />
          <BulletPoint text="Maintain confidentiality of your account" />
          <BulletPoint text="Not use the App for illegal purposes" />
          <BulletPoint text="Not share your credentials with others" />
        </Section>

        <Section title="5. Intellectual Property">
          <Text style={styles.paragraph}>
            All content, features, and functionality of the App are owned by Aapa Capital. You are granted a limited license to use the App for personal, non-commercial purposes only.
          </Text>
        </Section>

        <Section title="6. Limitation of Liability">
          <Text style={styles.paragraph}>
            THE APP IS PROVIDED "AS IS" WITHOUT WARRANTIES. To the maximum extent permitted by law, Aapa Capital shall not be liable for any indirect, incidental, or consequential damages.
          </Text>
        </Section>

        <Section title="7. Termination">
          <Text style={styles.paragraph}>
            We may suspend or terminate your access at any time for violation of these Terms. You may terminate your account by deleting it through the App.
          </Text>
        </Section>

        <Section title="8. Governing Law">
          <Text style={styles.paragraph}>
            These Terms shall be governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of courts in Ahmedabad, Gujarat, India.
          </Text>
        </Section>

        <Section title="9. Contact Information">
          <Text style={styles.paragraph}>
            For questions regarding these Terms, please contact us at:
          </Text>
          <Text style={styles.contactEmail}>info@aapacapital.com</Text>
        </Section>

        <View style={styles.acknowledgment}>
          <Text style={styles.acknowledgmentText}>
            BY USING THE AAPA CAPITAL APP, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS AND CONDITIONS AND AGREE TO BE BOUND BY THEM.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const BulletPoint: React.FC<{ text: string }> = ({ text }) => (
  <View style={styles.bulletPoint}>
    <Text style={styles.bullet}>•</Text>
    <Text style={styles.bulletText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    marginRight: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.light.text,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  lastUpdated: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.lg,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  subheading: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  paragraph: {
    fontSize: FontSizes.md,
    color: Colors.light.text,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  important: {
    fontSize: FontSizes.md,
    color: Colors.light.error,
    fontWeight: '600',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  bullet: {
    fontSize: FontSizes.md,
    color: Colors.light.primary,
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  bulletText: {
    fontSize: FontSizes.md,
    color: Colors.light.text,
    lineHeight: 24,
    flex: 1,
  },
  contactEmail: {
    fontSize: FontSizes.md,
    color: Colors.light.primary,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
  acknowledgment: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary,
    marginTop: Spacing.lg,
  },
  acknowledgmentText: {
    fontSize: FontSizes.sm,
    color: Colors.light.text,
    fontWeight: '600',
    lineHeight: 20,
  },
});
