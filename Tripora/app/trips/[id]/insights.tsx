import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import ScreenWrapper from '../../../src/components/ScreenWrapper';
import SectionHeader from '../../../src/components/SectionHeader';
import EmptyState from '../../../src/components/EmptyState';
import { useTripStore } from '../../../src/store/tripStore';
import { apiFetch } from '../../../src/services/api';

export default function TripInsightsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { activeTrips } = useTripStore();
  const trip = activeTrips[id as string];

  const [insights, setInsights] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!id) return;
    const fetchInsights = async () => {
      try {
        const res = await apiFetch(`/api/trips/${id}/insights`);
        if (res.data) setInsights(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, [id]);

  if (!trip) return null;

  const travelDays = insights?.travelDays || 1; 
  const costPerDay = (trip.estimatedTotalCost / travelDays) || 0;

  const metrics = [
    { title: 'Est. Total Cost', value: `$${trip.estimatedTotalCost.toLocaleString()}`, icon: 'account-balance-wallet', color: '#10B981', family: 'MaterialIcons' },
    { title: 'Cost Per Day', value: `$${costPerDay.toFixed(0)}`, icon: 'pie-chart', color: '#3B82F6', family: 'MaterialIcons' },
    { title: 'Cities', value: insights?.cities?.toString() || '0', icon: 'location-city', color: '#F59E0B', family: 'MaterialIcons' },
    { title: 'Activities', value: insights?.activityCount?.toString() || '0', icon: 'local-activity', color: '#7C3AED', family: 'MaterialIcons' },
    { title: 'Est. Distance', value: insights?.estimatedDistance || '0 km', icon: 'map', color: '#EF4444', family: 'Ionicons' },
    { title: 'Free Time', value: insights?.freeTime || '0 hr/day', icon: 'time', color: '#8B5CF6', family: 'Ionicons' }
  ];

  const total = trip.estimatedTotalCost || 1; 

  const distribution = [
    { category: 'Transport', percentage: (trip.costBreakdown.transport / total) * 100, color: '#3B82F6', amount: trip.costBreakdown.transport },
    { category: 'Stay', percentage: (trip.costBreakdown.accommodation / total) * 100, color: '#10B981', amount: trip.costBreakdown.accommodation },
    { category: 'Activities', percentage: (trip.costBreakdown.activities / total) * 100, color: '#7C3AED', amount: trip.costBreakdown.activities },
    { category: 'Food', percentage: (trip.costBreakdown.food / total) * 100, color: '#F59E0B', amount: trip.costBreakdown.food },
    { category: 'Misc', percentage: (trip.costBreakdown.miscellaneous / total) * 100, color: '#EC4899', amount: trip.costBreakdown.miscellaneous }
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

      {total === 0 || loading ? (
        <View className="flex-1 px-6 pt-10">
          {loading ? (
             <Text className="text-gray-400 text-center font-medium mt-10">Loading insights...</Text>
          ) : (
             <EmptyState 
               title="No Insights Available" 
               description="Start building your itinerary and budget to get AI-powered health scores, metrics, and distribution analytics."
               iconName="lightbulb-outline"
               actionTitle="Plan Itinerary"
               onActionPress={() => router.push(`/trips/${id}` as any)}
             />
          )}
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
          
          <View className="bg-primary rounded-3xl p-6 mb-8 shadow-md shadow-primary/30">
          <Text className="text-purple-100 font-medium mb-1 uppercase tracking-wider text-xs">Trip Health</Text>
          <Text className="text-white text-2xl font-bold mb-4">{insights?.tripHealth || 'Analyzing...'}</Text>
          <View className="flex-row items-center bg-white/20 p-3 rounded-xl mb-4">
            <Ionicons name="sparkles" size={20} color="white" />
            <Text className="text-white ml-2 flex-1 text-sm leading-5">{insights?.healthDescription || 'Calculating your trip health...'}</Text>
          </View>
        </View>

        {insights?.costInsights && insights.costInsights.length > 0 && (
           <View className="mb-8">
              <SectionHeader title="Cost Intelligence" />
              {insights.costInsights.map((ci: string, i: number) => (
                <View key={i} className="flex-row items-center mb-2 bg-green-50 p-3 rounded-xl">
                   <MaterialIcons name="insights" size={20} color="#10B981" />
                   <Text className="text-green-800 ml-2 font-medium text-sm flex-1">{ci}</Text>
                </View>
              ))}
           </View>
        )}

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
                <Text className="text-gray-900 font-bold">${item.amount.toLocaleString()} ({item.percentage.toFixed(0)}%)</Text>
              </View>
              <View className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <View 
                  className="h-full rounded-full" 
                  style={{ width: `${Math.min(item.percentage, 100)}%`, backgroundColor: item.color }} 
                />
              </View>
            </View>
          ))}
        </View>
        
        </ScrollView>
      )}
    </ScreenWrapper>
  );
}
