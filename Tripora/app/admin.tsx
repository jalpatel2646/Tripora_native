import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenWrapper from '../src/components/ScreenWrapper';

export default function AdminDashboardScreen() {
  const router = useRouter();

  return (
    <ScreenWrapper className="bg-gray-50 flex-1">
      {/* Header */}
      <View className="px-6 pt-4 pb-4 border-b border-gray-100 flex-row items-center z-10 bg-white shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <MaterialIcons name="arrow-back" size={24} color="#4B5563" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 ml-2">App Metrics</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24 }}>
        <View className="bg-primary p-6 rounded-3xl mb-6 shadow-md shadow-primary/30 items-center">
           <MaterialIcons name="insights" size={40} color="white" />
           <Text className="text-white text-lg font-bold mt-2">Active Users</Text>
           <Text className="text-white text-5xl font-black">12.4k</Text>
        </View>

        <View className="flex-row space-x-4 mb-6">
           <View className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 items-center">
              <Text className="text-gray-500 font-medium mb-1">Total Trips</Text>
              <Text className="text-3xl font-bold text-gray-900">45k</Text>
           </View>
           <View className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 items-center">
              <Text className="text-gray-500 font-medium mb-1">Destinations</Text>
              <Text className="text-3xl font-bold text-gray-900">289</Text>
           </View>
        </View>

        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 border-dashed">
           <Text className="font-bold text-gray-900 text-lg mb-2">Metrics Snapshot (Mock)</Text>
           <Text className="text-gray-500 leading-tight">
              The platform is performing robustly. Core metrics show a high engagement in user's itinerary building behavior.
           </Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
