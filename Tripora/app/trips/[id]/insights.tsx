import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import ScreenWrapper from '../../../src/components/ScreenWrapper';
import SectionHeader from '../../../src/components/SectionHeader';

export default function TripInsightsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const metrics = [
    { title: 'Total Budget', value: '$400', icon: 'account-balance-wallet', color: '#10B981', family: 'MaterialIcons' },
    { title: 'Cost Per Day', value: '$57', icon: 'pie-chart', color: '#3B82F6', family: 'MaterialIcons' },
    { title: 'Cities', value: '3', icon: 'location-city', color: '#F59E0B', family: 'MaterialIcons' },
    { title: 'Activities', value: '12', icon: 'local-activity', color: '#7C3AED', family: 'MaterialIcons' },
    { title: 'Est. Distance', value: '850 km', icon: 'map', color: '#EF4444', family: 'Ionicons' },
    { title: 'Free Time', value: '4 hr/day', icon: 'time', color: '#8B5CF6', family: 'Ionicons' }
  ];

  const distribution = [
    { category: 'Transport', percentage: 35, color: '#3B82F6', amount: 150 },
    { category: 'Stay', percentage: 25, color: '#10B981', amount: 100 },
    { category: 'Activities', percentage: 28, color: '#7C3AED', amount: 120 },
    { category: 'Food', percentage: 12, color: '#F59E0B', amount: 60 }
  ];

  return (
    <ScreenWrapper className="bg-gray-50 flex-1">
      <View className="px-6 pt-4 pb-4 border-b border-gray-100 flex-row justify-between items-center z-10 bg-white shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <MaterialIcons name="arrow-back" size={24} color="#4B5563" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Trip Insights</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        
        <View className="bg-primary rounded-3xl p-6 mb-8 shadow-md shadow-primary/30">
          <Text className="text-purple-100 font-medium mb-1 uppercase tracking-wider text-xs">Trip Health</Text>
          <Text className="text-white text-2xl font-bold mb-4">Excellent Pace</Text>
          <View className="flex-row items-center bg-white/20 p-3 rounded-xl mb-4">
            <Ionicons name="sparkles" size={20} color="white" />
            <Text className="text-white ml-2 flex-1 text-sm leading-5">Your itinerary is well-balanced with a good mix of activities and free time.</Text>
          </View>
        </View>

        <SectionHeader title="Key Metrics" />
        <View className="flex-row flex-wrap justify-between mb-8">
          {metrics.map((m, idx) => (
            <View key={idx} className="w-[48%] bg-white p-4 rounded-2xl mb-4 shadow-sm border border-gray-100 flex-row items-center">
              <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: m.color + '20' }}>
                {m.family === 'MaterialIcons' ? (
                  <MaterialIcons name={m.icon as any} size={20} color={m.color} />
                ) : (
                  <Ionicons name={m.icon as any} size={20} color={m.color} />
                )}
              </View>
              <View className="flex-1">
                <Text className="text-gray-500 text-xs mb-0.5">{m.title}</Text>
                <Text className="text-gray-900 font-bold text-sm">{m.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <SectionHeader title="Budget Distribution" />
        <View className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-8">
          {distribution.map((item, idx) => (
            <View key={idx} className="mb-4 last:mb-0">
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-700 font-medium">{item.category}</Text>
                <Text className="text-gray-900 font-bold">${item.amount} ({item.percentage}%)</Text>
              </View>
              <View className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <View 
                  className="h-full rounded-full" 
                  style={{ width: `${item.percentage}%`, backgroundColor: item.color }} 
                />
              </View>
            </View>
          ))}
        </View>
        
      </ScrollView>
    </ScreenWrapper>
  );
}
