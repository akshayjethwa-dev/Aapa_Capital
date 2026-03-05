import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Logo } from '../../components/common/Logo';
import { Button } from '../../components/common/Button';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Logo />
        
        <View style={styles.illustration}>
          {/* Add your illustration or image here */}
          <Text style={styles.illustrationText}>📈</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome to Aapa Capital</Text>
          <Text style={styles.subtitle}>
            Start your investment journey with India's most trusted Demat account platform
          </Text>
        </View>

        <View style={styles.features}>
          <FeatureItem icon="✓" text="Zero account opening charges" />
          <FeatureItem icon="✓" text="100% paperless process" />
          <FeatureItem icon="✓" text="Open account in 10 minutes" />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Get Started"
            onPress={() => router.push('/(auth)/login')}
            style={styles.button}
          />
          <Text style={styles.terms}>
            By continuing, you agree to our Terms & Conditions
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const FeatureItem: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'space-between',
    paddingVertical: Spacing.xl,
  },
  illustration: {
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  illustrationText: {
    fontSize: 80,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    marginBottom: Spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  featureIcon: {
    fontSize: FontSizes.lg,
    marginRight: Spacing.sm,
    color: Colors.light.success,
  },
  featureText: {
    fontSize: FontSizes.md,
    color: Colors.light.text,
  },
  buttonContainer: {
    gap: Spacing.md,
  },
  button: {
    width: '100%',
  },
  terms: {
    fontSize: FontSizes.xs,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});
