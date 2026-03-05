import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Animated, Alert } from 'react-native';
import { router } from 'expo-router';
import { signOut, deleteUser } from 'firebase/auth';
import { ref, remove } from 'firebase/database';
import { auth, database } from '../config/firebase';
import { useFormStore } from '../hooks/useFormStore';
import { Colors, Spacing, FontSizes, BorderRadius } from '../constants/Colors';
import Toast from 'react-native-toast-message';
import { LogOut, PartyPopper, Trash2 } from 'lucide-react-native';
import { Logo } from '../components/common/Logo';

export default function DashboardScreen() {
  const { user, resetForm } = useFormStore();
  
  // Animation values
  const slideUpAnim = useRef(new Animated.Value(100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered entrance
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideUpAnim, { toValue: 0, tension: 50, friction: 7, useNativeDriver: true })
    ]).start();

    // Bouncing icon effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: -10, duration: 500, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 500, useNativeDriver: true })
      ])
    ).start();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      resetForm();
      router.replace('/(auth)/welcome');
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error logging out', text2: error.message });
    }
  };

  const confirmDeleteAccount = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      // 1. Remove user data from Realtime Database
      await remove(ref(database, `users/${currentUser.uid}`));
      
      // 2. Delete the user from Firebase Auth
      await deleteUser(currentUser);
      
      // 3. Clear local state and redirect
      resetForm();
      Toast.show({ type: 'success', text1: 'Account Deleted', text2: 'Your waitlist spot has been removed.' });
      router.replace('/(auth)/welcome');
    } catch (error: any) {
      // Firebase requires a recent login to perform sensitive actions like deletion
      if (error.code === 'auth/requires-recent-login') {
        Toast.show({ 
          type: 'error', 
          text1: 'Authentication Required', 
          text2: 'Please log out and log back in to delete your account.' 
        });
      } else {
        Toast.show({ type: 'error', text1: 'Error deleting account', text2: error.message });
      }
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This will remove you from the exclusive waitlist and cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: confirmDeleteAccount }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Logo size={40} />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut color={Colors.light.error} size={24} />
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }]}>
        
        <Animated.View style={[styles.iconContainer, { transform: [{ translateY: bounceAnim }] }]}>
          <PartyPopper color={Colors.light.primary} size={60} />
        </Animated.View>

        <Text style={styles.title}>You're on the Waitlist!</Text>
        <Text style={styles.subtitle}>
          Hey {user?.email}, thank you for registering.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>What happens next?</Text>
          <Text style={styles.cardText}>
            We are working hard to bring you a fearless trading experience. 
            You will be among the first ones to get notified when Aapa Capital goes live.
          </Text>
          <View style={styles.highlightBox}>
             <Text style={styles.highlightText}>
               Keep an eye on your email for early access and exclusive pre-launch rewards!
             </Text>
          </View>
        </View>

        {/* Delete Account Button */}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Trash2 color={Colors.light.error} size={18} />
          <Text style={styles.deleteButtonText}>Delete My Account</Text>
        </TouchableOpacity>

      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.light.border, backgroundColor: Colors.light.surface },
  logoutButton: { padding: Spacing.sm, backgroundColor: `${Colors.light.error}15`, borderRadius: 50 },
  content: { flex: 1, padding: Spacing.lg, alignItems: 'center', justifyContent: 'center' },
  iconContainer: { width: 120, height: 120, borderRadius: 60, backgroundColor: Colors.light.surface, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xl, shadowColor: Colors.light.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 15, elevation: 8 },
  title: { fontSize: 32, fontWeight: '900', color: Colors.light.text, textAlign: 'center', marginBottom: Spacing.sm },
  subtitle: { fontSize: FontSizes.lg, color: Colors.light.textSecondary, textAlign: 'center', marginBottom: Spacing.xl, fontWeight: '500' },
  card: { backgroundColor: Colors.light.surface, padding: Spacing.xl, borderRadius: BorderRadius.lg, width: '100%', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  cardTitle: { fontSize: FontSizes.xl, fontWeight: 'bold', color: Colors.light.text, marginBottom: Spacing.md },
  cardText: { fontSize: FontSizes.md, color: Colors.light.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: Spacing.md },
  highlightBox: { backgroundColor: `${Colors.light.primary}10`, padding: Spacing.md, borderRadius: BorderRadius.md, marginTop: Spacing.sm },
  highlightText: { fontSize: FontSizes.md, color: Colors.light.primary, fontWeight: '700', textAlign: 'center', lineHeight: 22 },
  
  // New Delete Button Styles
  deleteButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: Spacing.xxl, padding: Spacing.md },
  deleteButtonText: { color: Colors.light.error, fontSize: FontSizes.md, fontWeight: '600', marginLeft: Spacing.sm },
});