import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenWrapper from '../src/components/ScreenWrapper';
import { apiFetch } from '../src/services/api';
import { toast } from '../src/store/toastStore';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchMetrics = async () => {
      try {
        const res = await apiFetch('/api/admin/metrics');
        if (mounted && res.data) setMetrics(res.data);
      } catch (err) {
        if (mounted) {
          toast.error('Failed to load metrics. Restrict to ADMIN role?');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchMetrics();
    return () => { mounted = false; };
  }, []);

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
        {loading ? (
            <ActivityIndicator size="large" color="#7C3AED" className="my-10" />
        ) : metrics ? (
          <>
            <View className="bg-primary p-6 rounded-3xl mb-6 shadow-md shadow-primary/30 items-center">
              <MaterialIcons name="insights" size={40} color="white" />
              <Text className="text-white text-lg font-bold mt-2">Active Users</Text>
              <Text className="text-white text-5xl font-black">{metrics.activeUsers}</Text>
            </View>

            <View className="flex-row space-x-4 mb-6">
              <View className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 items-center mr-2">
                  <Text className="text-gray-500 font-medium mb-1 xs">Total Trips</Text>
                  <Text className="text-3xl font-bold text-gray-900">{metrics.totalTrips}</Text>
              </View>
              <View className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 items-center ml-2">
                  <Text className="text-gray-500 font-medium mb-1 xs text-center">Activities</Text>
                  <Text className="text-3xl font-bold text-gray-900">{metrics.totalActivities}</Text>
              </View>
            </View>

            <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 border-dashed">
              <Text className="font-bold text-gray-900 text-lg mb-2">Metrics Snapshot</Text>
              <Text className="text-gray-500 leading-tight">
                  The platform is performing robustly. Average trip duration is {metrics.avgTripDuration} days.
              </Text>
            </View>
          </>
        ) : (
          <View className="items-center justify-center py-20 pointer-events-none">
            <MaterialIcons name="security" size={48} color="#EF4444" />
            <Text className="text-red-500 font-bold mt-4">Access Denied</Text>
            <Text className="text-gray-500 text-center mt-2">You likely don't have the ADMIN role required to view real metrics.</Text>
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}
