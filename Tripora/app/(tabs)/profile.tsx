import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenWrapper from '../../src/components/ScreenWrapper';
import SectionHeader from '../../src/components/SectionHeader';
import InputField from '../../src/components/InputField';
import PrimaryButton from '../../src/components/PrimaryButton';
import { useCameraStore } from '../../src/store/cameraStore';

const MOCK_SAVED_DESTINATIONS: string[] = [];

export default function ProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState('Alex Traveler');
  const [email, setEmail] = useState('alex@globe-trotter.mock');
  const [language, setLanguage] = useState('English');
  const [saving, setSaving] = useState(false);

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
      Alert.alert('Success', 'Profile updated successfully.');
    }, 1000);
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => router.replace('/') }
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action is irreversible. All your trips will be permanently deleted. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => router.replace('/') }
      ]
    );
  };

  return (
    <ScreenWrapper>
      <View className="px-6 pt-6 pb-4 border-b border-gray-100 flex-row justify-between items-center bg-gray-50">
        <Text className="text-2xl font-bold text-gray-900">Profile</Text>
        <TouchableOpacity onPress={handleLogout} className="p-2 border border-gray-200 rounded-full flex-row items-center">
          <MaterialIcons name="logout" size={20} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
         
         {/* Profile Picture Camera integration */}
         <View className="items-center mb-8">
            <View className="w-24 h-24 bg-purple-100 rounded-full items-center justify-center overflow-hidden mb-3">
              {profileImage ? (
                 <Image source={{ uri: profileImage }} style={{ width: 96, height: 96 }} />
              ) : (
                 <MaterialIcons name="person" size={48} color="#7C3AED" />
              )}
            </View>
            <TouchableOpacity onPress={() => router.push('/camera?mode=profile')}>
               <Text className="text-primary font-bold bg-purple-50 px-4 py-1.5 rounded-full overflow-hidden mt-1">{profileImage ? 'Update Photo' : 'Add Photo'}</Text>
            </TouchableOpacity>
         </View>

         <View className="mb-6">
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

         <View className="mb-8 border-b border-gray-100 pb-8">
            <SectionHeader title="Preferences" />
            <View className="flex-row items-center justify-between bg-white px-4 py-3 rounded-2xl border border-gray-100 shadow-sm">
               <View className="flex-row items-center">
                  <MaterialIcons name="language" size={24} color="#6B7280" />
                  <Text className="text-base text-gray-900 ml-3">Language</Text>
               </View>
               <TouchableOpacity 
                 onPress={() => Alert.alert('Select Language', 'Pretend a dropdown opened!')}
                 className="flex-row items-center space-x-1"
               >
                 <Text className="text-primary font-bold">{language}</Text>
                 <MaterialIcons name="arrow-drop-down" size={24} color="#7C3AED" />
               </TouchableOpacity>
            </View>
         </View>

         <View className="mb-8">
            <SectionHeader title="Saved Destinations" />
            {MOCK_SAVED_DESTINATIONS.length > 0 ? (
              MOCK_SAVED_DESTINATIONS.map((dest, i) => (
                 <View key={i} className="flex-row items-center justify-between bg-white p-4 mb-2 rounded-2xl border border-gray-100 shadow-sm">
                   <View className="flex-row items-center">
                      <MaterialIcons name="favorite" size={20} color="#EF4444" />
                      <Text className="text-gray-900 font-medium ml-3">{dest}</Text>
                   </View>
                 </View>
              ))
            ) : (
              <Text className="text-gray-500 text-center py-4 bg-white rounded-2xl border border-gray-100">No saved destinations yet.</Text>
            )}
         </View>

         <PrimaryButton 
           title="Save Changes" 
           onPress={handleSave} 
           loading={saving} 
           className="mb-8 border border-primary" 
         />

         <TouchableOpacity 
           onPress={handleDeleteAccount} 
           className="bg-red-50 p-4 rounded-2xl flex-row items-center justify-center border border-red-100 mb-8"
         >
            <MaterialIcons name="delete-forever" size={20} color="#EF4444" />
            <Text className="text-red-600 font-bold ml-2">Delete Account</Text>
         </TouchableOpacity>

         <TouchableOpacity onPress={() => router.push('/admin')}>
           <Text className="text-center text-gray-400 text-xs mt-2">Tripora App Version 1.0.0 (Admin)</Text>
         </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}
