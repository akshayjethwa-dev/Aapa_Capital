import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { useFormStore } from '../hooks/useFormStore';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, database } from '../config/firebase';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { setUser } = useFormStore();
  const router = useRouter();
  const segments = useSegments();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Fetch user data from Database to check onboarding status
          const snapshot = await get(ref(database, `users/${firebaseUser.uid}`));
          const userData = snapshot.val();

          setUser({
            uid: firebaseUser.uid,
            mobile: firebaseUser.phoneNumber || '',
            email: firebaseUser.email || undefined,
            registrationComplete: userData?.onboardingComplete || false, 
            createdAt: Date.now(),
          });
          
          // Smart Routing based on data
          if (userData?.onboardingComplete) {
            if (segments[0] !== 'dashboard') router.replace('/dashboard');
          } else {
            if (segments[0] !== 'onboarding') router.replace('/onboarding');
          }

        } else {
          setUser(null);
          if (segments[0] !== '(auth)') {
             router.replace('/(auth)/welcome');
          }
        }
      } catch (error) {
        console.error("Firebase Auth Error:", error);
      } finally {
        setIsInitializing(false);
        await SplashScreen.hideAsync();
      }
    });

    return unsubscribe;
  }, []);

  if (isInitializing) return null; 

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)/welcome" />
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="terms" options={{ headerShown: true, title: 'Terms & Conditions' }} />
        <Stack.Screen name="privacy" options={{ headerShown: true, title: 'Privacy Policy' }} />
      </Stack>
      <Toast />
    </>
  );
}