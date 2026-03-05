import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Logo } from '../../components/common/Logo';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';
import { useFormStore } from '../../hooks/useFormStore';
import Toast from 'react-native-toast-message';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, database } from '../../config/firebase'; // Ensure database is exported here

const mobileSchema = z.object({
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Invalid mobile number'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type MobileFormData = z.infer<typeof mobileSchema>;

export default function LoginScreen() {
  const { setFormData } = useFormStore();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const form = useForm<MobileFormData>({
    resolver: zodResolver(mobileSchema),
    defaultValues: {
      mobile: '',
      email: '',
      password: '',
    },
  });

  const handleAuth = async (data: MobileFormData) => {
    try {
      setLoading(true);

      if (isSignUp) {
        // Sign up new user
        await createUserWithEmailAndPassword(auth, data.email, data.password);
        Toast.show({
          type: 'success',
          text1: 'Account Created',
          text2: 'Welcome to Aapa Capital',
        });
      } else {
        // Sign in existing user
        await signInWithEmailAndPassword(auth, data.email, data.password);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Login successful',
        });
      }

      // 🚨 CRITICAL FIX: Check user profile before routing
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = ref(database, `users/${currentUser.uid}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists() && snapshot.val().registrationComplete) {
          // Existing user who completed setup goes to Dashboard
          router.replace('/dashboard');
        } else {
          // New or incomplete user goes to Step 1
          setFormData({ mobile: data.mobile, email: data.email });
          router.replace('/(registration)/step1-mobile');
        }
      }

    } catch (error: any) {
      const errorMessage = error.code === 'auth/user-not-found'
        ? 'No account found with this email'
        : error.code === 'auth/wrong-password'
        ? 'Incorrect password'
        : error.code === 'auth/email-already-in-use'
        ? 'Email already in use'
        : error.message || 'Authentication failed';

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Added keyboardShouldPersistTaps to dismiss keyboard on outside tap */}
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Logo />

          <View style={styles.formContainer}>
            <Text style={styles.title}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </Text>
            <Text style={styles.subtitle}>
              {isSignUp
                ? 'Sign up to start your investment journey'
                : 'Sign in to continue'}
            </Text>

            <View style={styles.form}>
              <Controller
                control={form.control}
                name="mobile"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Input
                    label="Mobile Number"
                    placeholder="Enter 10-digit mobile number"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={value}
                    onChangeText={onChange}
                    error={error?.message}
                  />
                )}
              />

              <Controller
                control={form.control}
                name="email"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Input
                    label="Email Address"
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    error={error?.message}
                  />
                )}
              />

              <Controller
                control={form.control}
                name="password"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Input
                    label="Password"
                    placeholder="Enter password (min 6 characters)"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    error={error?.message}
                  />
                )}
              />

              <Button
                title={isSignUp ? 'Sign Up' : 'Sign In'}
                onPress={form.handleSubmit(handleAuth)}
                loading={loading}
              />

              <Text style={styles.switchText}>
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                <Text
                  style={styles.switchLink}
                  onPress={() => setIsSignUp(!isSignUp)}
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </Text>
              </Text>
            </View>
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
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  formContainer: {
    marginTop: Spacing.xl,
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
    marginBottom: Spacing.xl,
  },
  form: {
    gap: Spacing.md,
  },
  switchText: {
    fontSize: FontSizes.md,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  switchLink: {
    color: Colors.light.primary,
    fontWeight: '600',
  },
});