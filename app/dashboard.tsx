import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { signOut, deleteUser } from 'firebase/auth';
import { ref, remove } from 'firebase/database';
import { auth, database } from '../config/firebase';
import { useFormStore } from '../hooks/useFormStore';
import { Colors, Spacing, FontSizes, BorderRadius } from '../constants/Colors';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import Toast from 'react-native-toast-message';
import {
  LogOut,
  Trash2,
  TrendingUp,
  Wallet,
  PieChart,
  Settings,
} from 'lucide-react-native';

export default function DashboardScreen() {
  const { user, resetForm } = useFormStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              resetForm();
              router.replace('/(auth)/welcome');
              Toast.show({
                type: 'success',
                text1: 'Logged out successfully',
              });
            } catch (error: any) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message,
              });
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      Toast.show({
        type: 'error',
        text1: 'Invalid confirmation',
        text2: 'Please type DELETE to confirm',
      });
      return;
    }

    try {
      setLoading(true);
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error('No user logged in');
      }

      // Delete user data from database
      const userRef = ref(database, `users/${currentUser.uid}`);
      await remove(userRef);

      // Delete user account
      await deleteUser(currentUser);

      resetForm();
      setShowDeleteModal(false);
      router.replace('/(auth)/welcome');

      Toast.show({
        type: 'success',
        text1: 'Account deleted',
        text2: 'Your account has been permanently deleted',
      });
    } catch (error: any) {
    if (error.code === 'auth/requires-recent-login') {
        setShowDeleteModal(false);
        setDeleteConfirmation('');
        Alert.alert(
          'Security Check',
          'For security reasons, please log out and log back in to verify your identity before deleting your account.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Log Out Now', 
              style: 'destructive',
              onPress: async () => {
                await signOut(auth);
                resetForm();
                router.replace('/(auth)/welcome');
              }
            }
          ]
        );
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.message || 'Failed to delete account',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = () => {
    Alert.alert(
      'Delete Account',
      'This action is permanent and cannot be undone. All your data will be deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          style: 'destructive',
          onPress: () => setShowDeleteModal(true),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back!</Text>
            <Text style={styles.name}>{user?.name || 'User'}</Text>
          </View>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => {}}
          >
            <Settings color={Colors.light.text} size={24} />
          </TouchableOpacity>
        </View>

        {/* Account Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>Account Status</Text>
            <View
              style={[
                styles.statusBadge,
                user?.registrationComplete
                  ? styles.statusActive
                  : styles.statusPending,
              ]}
            >
              <Text style={styles.statusText}>
                {user?.registrationComplete ? 'Active' : 'Pending Verification'}
              </Text>
            </View>
          </View>
          {!user?.registrationComplete && (
            <Text style={styles.statusDescription}>
              Your documents are under verification. We'll notify you once approved.
            </Text>
          )}
        </View>

        {/* Portfolio Summary */}
        <View style={styles.portfolioCard}>
          <Text style={styles.cardTitle}>Portfolio Value</Text>
          <Text style={styles.portfolioValue}>₹0.00</Text>
          <View style={styles.portfolioChange}>
            <Text style={styles.changeText}>+₹0.00 (0.00%)</Text>
            <Text style={styles.changeLabel}>Today</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIconContainer}>
              <TrendingUp color={Colors.light.primary} size={24} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>View Portfolio</Text>
              <Text style={styles.actionSubtitle}>Check your investments</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIconContainer}>
              <Wallet color={Colors.light.success} size={24} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Add Funds</Text>
              <Text style={styles.actionSubtitle}>Deposit money</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIconContainer}>
              <PieChart color={Colors.light.warning} size={24} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Market Overview</Text>
              <Text style={styles.actionSubtitle}>View market trends</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Account Actions */}
        <View style={styles.accountActions}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleLogout}
          >
            <LogOut color={Colors.light.text} size={20} />
            <Text style={styles.actionButtonText}>Sign Out</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={openDeleteModal}
          >
            <Trash2 color={Colors.light.error} size={20} />
            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Delete Account Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Account</Text>
            <Text style={styles.modalText}>
              This action is permanent and cannot be undone. All your data,
              portfolio, and account information will be permanently deleted.
            </Text>

            <View style={styles.warningBox}>
              <Trash2 color={Colors.light.error} size={24} />
              <Text style={styles.warningText}>
                Type <Text style={styles.warningBold}>DELETE</Text> to confirm
              </Text>
            </View>

            <Input
              placeholder="Type DELETE"
              value={deleteConfirmation}
              onChangeText={setDeleteConfirmation}
              autoCapitalize="characters"
              containerStyle={styles.modalInput}
            />

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation('');
                }}
                variant="outline"
                style={styles.modalButtonLeft}
              />
              <Button
                title="Delete"
                onPress={handleDeleteAccount}
                loading={loading}
                disabled={deleteConfirmation !== 'DELETE'}
                style={styles.modalButtonRight}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  greeting: {
    fontSize: FontSizes.md,
    color: Colors.light.textSecondary,
  },
  name: {
    fontSize: FontSizes.xxxl,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: Spacing.xs,
  },
  settingsButton: {
    padding: Spacing.sm,
  },
  statusCard: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statusTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.light.text,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  statusActive: {
    backgroundColor: Colors.light.success,
  },
  statusPending: {
    backgroundColor: Colors.light.warning,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  statusDescription: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  portfolioCard: {
    backgroundColor: Colors.light.primary,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    fontSize: FontSizes.md,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: Spacing.xs,
  },
  portfolioValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: Spacing.xs,
  },
  portfolioChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  changeText: {
    fontSize: FontSizes.md,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  changeLabel: {
    fontSize: FontSizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  quickActions: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
  },
  accountActions: {
    marginBottom: Spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  actionButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: Colors.light.text,
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: Colors.light.error,
  },
  deleteButtonText: {
    color: Colors.light.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  modalText: {
    fontSize: FontSizes.md,
    color: Colors.light.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  warningText: {
    fontSize: FontSizes.sm,
    color: Colors.light.text,
    flex: 1,
  },
  warningBold: {
    fontWeight: 'bold',
    color: Colors.light.error,
  },
  modalInput: {
    marginBottom: Spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  modalButtonLeft: {
    flex: 1,
  },
  modalButtonRight: {
    flex: 1,
    backgroundColor: Colors.light.error,
  },
});
