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

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color={Colors.light.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.lastUpdated}>Last Updated: March 5, 2026</Text>

        <Section title="Introduction">
          <Text style={styles.paragraph}>
            Aapa Capital is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
          </Text>
          <Text style={styles.important}>
            This App is currently in pre-registration phase. We collect information solely for early registration purposes.
          </Text>
        </Section>

        <Section title="1. Information We Collect">
          <Text style={styles.subheading}>Personal Information:</Text>
          <BulletPoint text="Name, date of birth, gender" />
          <BulletPoint text="PAN and Aadhaar details" />
          <BulletPoint text="Contact information (phone, email, address)" />
          <BulletPoint text="Professional and financial information" />
          <BulletPoint text="Investment preferences and risk profile" />

          <Text style={[styles.subheading, { marginTop: Spacing.md }]}>
            Technical Information:
          </Text>
          <BulletPoint text="Device information and identifiers" />
          <BulletPoint text="Usage data and analytics" />
          <BulletPoint text="Location information (with permission)" />
        </Section>

        <Section title="2. How We Use Your Information">
          <BulletPoint text="Process your pre-registration application" />
          <BulletPoint text="Verify your identity (KYC compliance)" />
          <BulletPoint text="Communicate service updates" />
          <BulletPoint text="Comply with legal and regulatory requirements" />
          <BulletPoint text="Improve our App and services" />
          <BulletPoint text="Prevent fraud and unauthorized access" />
        </Section>

        <Section title="3. How We Share Your Information">
          <Text style={styles.paragraph}>
            We may share your information with:
          </Text>
          <BulletPoint text="Service providers (KYC verification, hosting)" />
          <BulletPoint text="Regulatory authorities (SEBI, RBI, Income Tax)" />
          <BulletPoint text="Legal authorities (when required by law)" />
          
          <Text style={styles.highlight}>
            We do NOT sell your personal information to third parties.
          </Text>
        </Section>

        <Section title="4. Data Security">
          <Text style={styles.paragraph}>
            We implement industry-standard security measures including:
          </Text>
          <BulletPoint text="256-bit SSL/TLS encryption" />
          <BulletPoint text="AES-256 encryption for data at rest" />
          <BulletPoint text="Secure cloud infrastructure" />
          <BulletPoint text="Regular security audits" />
          <BulletPoint text="Role-based access controls" />
        </Section>

        <Section title="5. Your Rights">
          <BulletPoint text="Access and correct your personal information" />
          <BulletPoint text="Request deletion of your account and data" />
          <BulletPoint text="Withdraw consent for marketing communications" />
          <BulletPoint text="Request a copy of your data" />
          <BulletPoint text="Lodge complaints with authorities" />
        </Section>

        <Section title="6. Data Retention">
          <Text style={styles.paragraph}>
            We retain your information for as long as your account is active or as required for legal compliance (typically 5-7 years for regulatory data).
          </Text>
        </Section>

        <Section title="7. Children's Privacy">
          <Text style={styles.paragraph}>
            Our App is NOT intended for users under 18 years of age. We do not knowingly collect information from children.
          </Text>
        </Section>

        <Section title="8. Cookies and Tracking">
          <Text style={styles.paragraph}>
            We use cookies and similar technologies to improve App functionality, analyze usage, and personalize your experience. You can manage cookies through your device settings.
          </Text>
        </Section>

        <Section title="9. Changes to This Policy">
          <Text style={styles.paragraph}>
            We may update this Privacy Policy from time to time. We will notify you of material changes via email or in-app notification.
          </Text>
        </Section>

        <Section title="10. Contact Us">
          <Text style={styles.paragraph}>
            For privacy-related inquiries, contact us at:
          </Text>
          <Text style={styles.contactEmail}>info@aapacapital.com</Text>
          
          <Text style={styles.paragraph}>
            We aim to respond within 7 business days.
          </Text>
        </Section>

        <View style={styles.acknowledgment}>
          <Text style={styles.acknowledgmentText}>
            BY USING THE AAPA CAPITAL APP, YOU ACKNOWLEDGE THAT YOU HAVE READ AND UNDERSTOOD THIS PRIVACY POLICY AND CONSENT TO THE COLLECTION, USE, AND DISCLOSURE OF YOUR INFORMATION AS DESCRIBED.
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
  highlight: {
    fontSize: FontSizes.md,
    color: Colors.light.success,
    fontWeight: '600',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
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
