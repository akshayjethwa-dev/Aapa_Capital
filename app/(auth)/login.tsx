import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Logo } from '../../components/common/Logo';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';
import Toast from 'react-native-toast-message';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../../config/firebase';
import { Eye, EyeOff, CheckSquare, Square } from 'lucide-react-native';

const authSchema = z.object({
  mobile: z.string().optional(),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Must contain at least one special character'),
});
type AuthFormData = z.infer<typeof authSchema>;

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false); // Checkbox state

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: { mobile: '', email: '', password: '' },
  });

  const handleAuth = async (data: AuthFormData) => {
    if (isSignUp && !agreedToTerms) {
      return Toast.show({ type: 'error', text1: 'Required', text2: 'Please agree to the Terms & Privacy Policy' });
    }

    try {
      setLoading(true);
      if (isSignUp) {
        if (!data.mobile || !/^[6-9]\d{9}$/.test(data.mobile)) {
          return Toast.show({ type: 'error', text1: 'Error', text2: 'Please enter a valid 10-digit mobile number' });
        }
        
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        const userRef = ref(database, `users/${userCredential.user.uid}`);
        
        await set(userRef, {
          uid: userCredential.user.uid,
          email: data.email,
          mobile: data.mobile,
          waitlist: true,
          onboardingComplete: false,
          agreedToTerms: true,
          createdAt: Date.now(),
        });
        
        Toast.show({ type: 'success', text1: 'Account Created', text2: 'Let\'s complete your profile!' });
        router.replace('/onboarding');
      } else {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        Toast.show({ type: 'success', text1: 'Success', text2: 'Welcome back!' });
        router.replace('/dashboard');
      }
    } catch (error: any) {
      const errorMessage = error.code === 'auth/user-not-found' ? 'No account found' : error.code === 'auth/wrong-password' ? 'Incorrect password' : error.code === 'auth/email-already-in-use' ? 'Email already in use.' : error.message;
      Toast.show({ type: 'error', text1: 'Error', text2: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const email = form.getValues('email');
    if (!email) return Toast.show({ type: 'error', text1: 'Email Required', text2: 'Enter email to reset password' });
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      Toast.show({ type: 'success', text1: 'Email Sent', text2: 'Check your inbox for reset instructions.' });
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Logo size={80} />
          <Text style={styles.brandTagline}>Trade Fearless</Text>

          <View style={styles.formContainer}>
            <Text style={styles.title}>{isSignUp ? 'Join the Waitlist' : 'Welcome Back'}</Text>
            <Text style={styles.subtitle}>
              {isSignUp ? 'Enter your details to get early access' : 'Sign in to check your waitlist status'}
            </Text>

            <View style={styles.form}>
              {isSignUp && (
                <Controller
                  control={form.control}
                  name="mobile"
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Input label="Mobile Number" placeholder="Enter 10-digit mobile" keyboardType="phone-pad" maxLength={10} value={value} onChangeText={onChange} error={error?.message} />
                  )}
                />
              )}
              <Controller
                control={form.control}
                name="email"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Input label="Email Address" placeholder="Enter your email" keyboardType="email-address" autoCapitalize="none" value={value} onChangeText={onChange} error={error?.message} />
                )}
              />
              <Controller
                control={form.control}
                name="password"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Input 
                    label="Password" 
                    placeholder="Enter password" 
                    secureTextEntry={!showPassword} 
                    value={value} 
                    onChangeText={onChange} 
                    error={error?.message} 
                    rightIcon={showPassword ? <EyeOff stroke={Colors.light.textSecondary} size={20} /> : <Eye stroke={Colors.light.textSecondary} size={20} />}
                    onRightIconPress={() => setShowPassword(!showPassword)}
                  />
                )}
              />

              {isSignUp && (
                <TouchableOpacity 
                  style={styles.checkboxContainer} 
                  onPress={() => setAgreedToTerms(!agreedToTerms)}
                  activeOpacity={0.7}
                >
                  {agreedToTerms ? (
                    <CheckSquare stroke={Colors.light.primary} size={22} fill={`${Colors.light.primary}20`} />
                  ) : (
                    <Square color={Colors.light.border} size={22} />
                  )}
                  <Text style={styles.checkboxText}>
                    I agree to the{' '}
                    <Text style={styles.linkText} onPress={() => router.push('/terms')}>Terms of Service</Text>
                    {' '}and{' '}
                    <Text style={styles.linkText} onPress={() => router.push('/privacy')}>Privacy Policy</Text>
                  </Text>
                </TouchableOpacity>
              )}

              {!isSignUp && (
                <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordContainer}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              )}

              <Button title={isSignUp ? 'Join Now' : 'Log In'} onPress={form.handleSubmit(handleAuth)} loading={loading} />

              <Text style={styles.switchText}>
                {isSignUp ? 'Already registered? ' : "Not on the waitlist yet? "}
                <Text style={styles.switchLink} onPress={() => { setIsSignUp(!isSignUp); form.reset(); setAgreedToTerms(false); }}>
                  {isSignUp ? 'Log In' : 'Join Now'}
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
  container: { flex: 1, backgroundColor: Colors.light.background },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: Spacing.lg, justifyContent: 'center' },
  brandTagline: { textAlign: 'center', color: Colors.light.primary, fontWeight: '800', fontSize: FontSizes.md, marginTop: Spacing.xs, letterSpacing: 1, textTransform: 'uppercase' },
  formContainer: { marginTop: Spacing.xl, backgroundColor: Colors.light.surface, padding: Spacing.lg, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  title: { fontSize: FontSizes.xxl, fontWeight: 'bold', color: Colors.light.text, marginBottom: Spacing.sm, textAlign: 'center' },
  subtitle: { fontSize: FontSizes.md, color: Colors.light.textSecondary, marginBottom: Spacing.xl, textAlign: 'center' },
  form: { gap: Spacing.md },
  checkboxContainer: { flexDirection: 'row', alignItems: 'flex-start', marginTop: Spacing.sm, marginBottom: Spacing.md, paddingRight: Spacing.md },
  checkboxText: { marginLeft: Spacing.sm, fontSize: FontSizes.sm, color: Colors.light.textSecondary, lineHeight: 20 },
  linkText: { color: Colors.light.primary, fontWeight: '700' },
  forgotPasswordContainer: { alignItems: 'flex-end', marginTop: -Spacing.sm, marginBottom: Spacing.sm },
  forgotPasswordText: { color: Colors.light.primary, fontSize: FontSizes.sm, fontWeight: '600' },
  switchText: { fontSize: FontSizes.md, color: Colors.light.textSecondary, textAlign: 'center', marginTop: Spacing.md },
  switchLink: { color: Colors.light.primary, fontWeight: 'bold' },
});