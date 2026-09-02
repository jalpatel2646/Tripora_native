import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenWrapper from '../../src/components/ScreenWrapper';
import SectionHeader from '../../src/components/SectionHeader';
import InputField from '../../src/components/InputField';
import PrimaryButton from '../../src/components/PrimaryButton';
import Button from '../../src/components/Button';
import ConfirmDialog from '../../src/components/ConfirmDialog';
import { useCameraStore } from '../../src/store/cameraStore';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';
import { toast } from '../../src/store/toastStore';
import EmptyState from '../../src/components/EmptyState';

const SAVED_DESTINATIONS: string[] = [];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { colors, typography, spacing, radius, themeType, setThemeType } = useTheme();

  const [name, setName] = useState(user?.name || 'Alex Traveler');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);

  // Dialog states
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  // Camera integration
  const { capturedUri, activeMode, clearCapturedImage } = useCameraStore();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    if (activeMode === 'profile' && capturedUri) {
      setProfileImage(capturedUri);
      clearCapturedImage();
    }
  }, [activeMode, capturedUri]);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Profile updated successfully.');
    }, 1000);
  };

  const handleLogout = async () => {
    setLogoutDialog(false);
    await logout();
    toast.info('Logged out successfully.');
    router.replace('/');
  };

  const handleDeleteAccount = () => {
    setDeleteDialog(false);
    toast.success('Account deleted successfully.');
    router.replace('/');
  };

  const cycleTheme = () => {
    if (themeType === 'system') setThemeType('light');
    else if (themeType === 'light') setThemeType('dark');
    else setThemeType('system');
  };

  return (
    <ScreenWrapper>
      <View style={{ 
        paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.sm,
        borderBottomWidth: 1, borderBottomColor: colors.border,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: colors.background
      }}>
        <Text style={{ fontSize: typography.sizes.xxl, fontWeight: typography.weights.bold, color: colors.text }}>
          Profile
        </Text>
        <TouchableOpacity onPress={() => setLogoutDialog(true)} style={{ padding: spacing.sm, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border }}>
          <MaterialIcons name="logout" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing.xl, paddingBottom: 100 }}>
         
         <View style={{ alignItems: 'center', marginBottom: spacing.xxxl }}>
            <View style={{ width: 96, height: 96, backgroundColor: colors.primary + '15', borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: spacing.md }}>
              {profileImage ? (
                 <Image source={{ uri: profileImage }} style={{ width: 96, height: 96 }} />
              ) : (
                 <MaterialIcons name="person" size={48} color={colors.primary} />
              )}
            </View>
            <TouchableOpacity onPress={() => router.push('/camera?mode=profile')}>
               <Text style={{ color: colors.primary, fontWeight: typography.weights.bold, backgroundColor: colors.primary + '10', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.full }}>
                 {profileImage ? 'Update Photo' : 'Add Photo'}
               </Text>
            </TouchableOpacity>
         </View>

         <View style={{ marginBottom: spacing.xxl }}>
            <InputField 
               label="Full Name" 
               value={name} 
               onChangeText={setName} 
            />
            <InputField 
               label="Email Address" 
               keyboardType="email-address"
               value={email} 
               onChangeText={setEmail}
               autoCapitalize="none"
            />
         </View>

         <View style={{ marginBottom: spacing.xxxl, borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: spacing.xxxl }}>
            <SectionHeader title="Settings" />
            
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md }}>
               <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialIcons name="brightness-6" size={24} color={colors.textSecondary} />
                  <Text style={{ fontSize: typography.sizes.md, color: colors.text, marginLeft: spacing.md }}>Theme</Text>
               </View>
               <TouchableOpacity onPress={cycleTheme} style={{ flexDirection: 'row', alignItems: 'center' }}>
                 <Text style={{ color: colors.primary, fontWeight: typography.weights.bold, marginRight: spacing.xs }}>
                   {themeType === 'system' ? 'System' : themeType === 'dark' ? 'Dark' : 'Light'}
                 </Text>
                 <MaterialIcons name="refresh" size={20} color={colors.primary} />
               </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => router.push('/contacts-manager')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border }}>
               <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialIcons name="contacts" size={24} color={colors.textSecondary} />
                  <Text style={{ fontSize: typography.sizes.md, color: colors.text, marginLeft: spacing.md }}>My Contacts</Text>
               </View>
               <MaterialIcons name="chevron-right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
         </View>

         <View style={{ marginBottom: spacing.xxxl }}>
            <SectionHeader title="Saved Destinations" />
            {SAVED_DESTINATIONS.length > 0 ? (
              SAVED_DESTINATIONS.map((dest, i) => (
                 <View key={i} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface, padding: spacing.lg, marginBottom: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border }}>
                   <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <MaterialIcons name="favorite" size={20} color={colors.error} />
                      <Text style={{ color: colors.text, fontWeight: typography.weights.medium, marginLeft: spacing.md }}>{dest}</Text>
                   </View>
                 </View>
              ))
            ) : (
               <EmptyState 
                  title="No Destinies" 
                  description="We have no saved destinations right now."
                  iconName="favorite-border"
               />
            )}
         </View>

         <View style={{ marginBottom: spacing.xxl }}>
           <Button title="Save Changes" onPress={handleSave} loading={saving} />
         </View>

         <TouchableOpacity 
           onPress={() => setDeleteDialog(true)} 
           style={{ backgroundColor: colors.error + '10', padding: spacing.lg, borderRadius: radius.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.error + '30', marginBottom: spacing.xxl }}
         >
            <MaterialIcons name="delete-forever" size={20} color={colors.error} />
            <Text style={{ color: colors.error, fontWeight: typography.weights.bold, marginLeft: spacing.md }}>Delete Account</Text>
         </TouchableOpacity>

         <TouchableOpacity onPress={() => router.push('/admin')}>
           <Text style={{ textAlign: 'center', color: colors.textSecondary, fontSize: typography.sizes.xs, marginTop: spacing.md }}>Tripora App Version 1.0.0 (Admin)</Text>
         </TouchableOpacity>
      </ScrollView>

      <ConfirmDialog
        visible={logoutDialog}
        title="Log Out"
        message="Are you sure you want to log out?"
        confirmTitle="Log Out"
        isDanger
        onConfirm={handleLogout}
        onCancel={() => setLogoutDialog(false)}
      />

      <ConfirmDialog
        visible={deleteDialog}
        title="Delete Account"
        message="This action is irreversible. All your trips will be permanently deleted. Are you sure?"
        confirmTitle="Delete"
        isDanger
        onConfirm={handleDeleteAccount}
        onCancel={() => setDeleteDialog(false)}
      />
    </ScreenWrapper>
  );
}
