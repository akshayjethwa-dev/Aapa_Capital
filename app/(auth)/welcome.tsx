import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Logo } from '../../components/common/Logo';
import { Button } from '../../components/common/Button';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';

export default function WelcomeScreen() {
  const router = useRouter();
  
  // Animation Values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance Animation (Fade in + Slide up)
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();

    // Continuous Pulse Animation for the Rocket/Centerpiece
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15, // Scale up by 15%
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1, // Scale back to normal
          duration: 1200,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        
        <View style={styles.header}>
          <Logo size={100} />
          <Text style={styles.tagline}>Trade Fearless</Text>
        </View>
        
        {/* Pulsing Central Element */}
        <Animated.View style={[styles.illustration, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.glowCircle}>
            <Text style={styles.illustrationText}>🚀</Text>
          </View>
        </Animated.View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Something Amazing is Coming!</Text>
          <Text style={styles.subtitle}>
            Join the exclusive waitlist for Aapa Capital. A revolutionary trading experience is just around the corner.
          </Text>
        </View>

        <View style={styles.features}>
          <FeatureItem icon="✨" text="Early Access to Platform" />
          <FeatureItem icon="🎁" text="Exclusive Pre-launch Rewards" />
          <FeatureItem icon="🔔" text="First to know when we go live" />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Join the Waitlist"
            onPress={() => router.push('/(auth)/login')}
            style={styles.button}
          />
          <Text style={styles.terms}>
            Be part of the future of trading.
          </Text>
        </View>

      </Animated.View>
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
  container: { flex: 1, backgroundColor: Colors.light.background },
  content: { flex: 1, paddingHorizontal: Spacing.lg, justifyContent: 'space-between', paddingVertical: Spacing.xl },
  header: { alignItems: 'center', marginTop: Spacing.md },
  tagline: { fontSize: FontSizes.lg, fontWeight: '800', color: Colors.light.primary, marginTop: Spacing.sm, letterSpacing: 2, textTransform: 'uppercase' },
  illustration: { alignItems: 'center', marginVertical: Spacing.md },
  glowCircle: { width: 150, height: 150, borderRadius: 75, backgroundColor: `${Colors.light.primary}15`, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: `${Colors.light.primary}30` },
  illustrationText: { fontSize: 70 },
  textContainer: { alignItems: 'center', marginBottom: Spacing.md },
  title: { fontSize: 28, fontWeight: '900', color: Colors.light.text, textAlign: 'center', marginBottom: Spacing.sm },
  subtitle: { fontSize: FontSizes.md, color: Colors.light.textSecondary, textAlign: 'center', lineHeight: 24, paddingHorizontal: Spacing.sm },
  features: { marginBottom: Spacing.xl, backgroundColor: Colors.light.surface, padding: Spacing.lg, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  featureIcon: { fontSize: FontSizes.lg, marginRight: Spacing.md },
  featureText: { fontSize: FontSizes.md, color: Colors.light.text, fontWeight: '600' },
  buttonContainer: { gap: Spacing.md },
  button: { width: '100%', height: 56, borderRadius: 12, shadowColor: Colors.light.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  terms: { fontSize: FontSizes.sm, color: Colors.light.textSecondary, textAlign: 'center', fontWeight: '500' },
});