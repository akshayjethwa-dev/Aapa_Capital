import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { useFormStore } from '../hooks/useFormStore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function RootLayout() {
  const { setUser, setStep } = useFormStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          mobile: firebaseUser.phoneNumber || '',
          email: firebaseUser.email || undefined,
          registrationComplete: false,
          createdAt: Date.now(),
        });
        setStep('DASHBOARD');
      } else {
        setUser(null);
        setStep('WELCOME');
      }
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)/welcome" />
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(registration)/step1-mobile" />
        <Stack.Screen name="(registration)/step2-personal" />
        <Stack.Screen name="(registration)/step3-professional" />
        <Stack.Screen name="(registration)/step4-investment" />
        <Stack.Screen name="(registration)/step5-risk" />
        <Stack.Screen name="(registration)/step6-review" />
        <Stack.Screen name="success" />
        <Stack.Screen name="dashboard" />
      </Stack>
      <Toast />
    </>
  );
}
