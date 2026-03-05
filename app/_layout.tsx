import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { useFormStore } from '../hooks/useFormStore';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, database } from '../config/firebase';
import * as SplashScreen from 'expo-splash-screen';

// 🚨 PREVENT SPLASH SCREEN FROM AUTO-HIDING
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { setUser, setStep } = useFormStore();
  const router = useRouter();
  const segments = useSegments();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Fetch user data from Realtime Database
          const userRef = ref(database, `users/${firebaseUser.uid}`);
          const snapshot = await get(userRef);
          
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUser(userData);
            
            // Route based on registration completion
            if (userData.registrationComplete && segments[0] !== 'dashboard') {
              router.replace('/dashboard');
            } else if (!userData.registrationComplete && segments[0] !== '(registration)') {
              router.replace('/(registration)/step1-mobile');
            }
          } else {
            // New user, minimal state
            setUser({
              uid: firebaseUser.uid,
              mobile: firebaseUser.phoneNumber || '',
              email: firebaseUser.email || undefined,
              registrationComplete: false,
              createdAt: Date.now(),
            });
            
            if (segments[0] !== '(registration)') {
              router.replace('/(registration)/step1-mobile');
            }
          }
        } else {
          setUser(null);
          setStep('WELCOME');
          if (segments[0] !== '(auth)') {
             router.replace('/(auth)/welcome');
          }
        }
      } catch (error) {
        // Log background database/auth errors to the console instead of Sentry
        console.error("Firebase Auth/DB Error:", error);
      } finally {
        setIsInitializing(false);
        // 🚨 HIDE SPLASH SCREEN NOW THAT ROUTING IS FIGURED OUT
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