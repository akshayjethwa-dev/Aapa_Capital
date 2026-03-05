import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../components/common/Button';
import { Colors, Spacing, FontSizes } from '../constants/Colors';
import { CheckCircle } from 'lucide-react-native';

export default function SuccessScreen() {
  const router = useRouter();
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Scale animation for checkmark
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Fade in animation for text
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      delay: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.iconCircle}>
            <CheckCircle color="#FFFFFF" size={64} strokeWidth={2} />
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={styles.title}>Registration Successful!</Text>
          <Text style={styles.subtitle}>
            Your Demat account application has been submitted successfully.
          </Text>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>What's Next?</Text>
            <View style={styles.stepItem}>
              <Text style={styles.stepNumber}>1</Text>
              <Text style={styles.stepText}>
                Our team will verify your documents within 24-48 hours
              </Text>
            </View>
            <View style={styles.stepItem}>
              <Text style={styles.stepNumber}>2</Text>
              <Text style={styles.stepText}>
                You'll receive a confirmation email once approved
              </Text>
            </View>
            <View style={styles.stepItem}>
              <Text style={styles.stepNumber}>3</Text>
              <Text style={styles.stepText}>
                Start investing immediately after approval
              </Text>
            </View>
          </View>

          <View style={styles.contactCard}>
            <Text style={styles.contactIcon}>💬</Text>
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Need Help?</Text>
              <Text style={styles.contactText}>
                Contact our support team at support@aapacapital.com
              </Text>
            </View>
          </View>
        </Animated.View>

        <Button
          title="Go to Dashboard"
          onPress={() => router.replace('/dashboard')}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.light.success,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.light.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  textContainer: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xxxl,
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
    marginBottom: Spacing.xl,
  },
  infoCard: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.md,
  },
  infoTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    color: '#FFFFFF',
    fontSize: FontSizes.sm,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: Spacing.md,
  },
  stepText: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.light.text,
    lineHeight: 22,
  },
  contactCard: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surface,
    padding: Spacing.md,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary,
  },
  contactIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  contactText: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  button: {
    marginTop: Spacing.lg,
  },
});
