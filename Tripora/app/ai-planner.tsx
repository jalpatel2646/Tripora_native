import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../src/components/ScreenWrapper';
import PrimaryButton from '../src/components/PrimaryButton';
import SectionHeader from '../src/components/SectionHeader';
import { generateTripPlan, TripPlanResponse } from '../src/services/ai';
import { useTripStore } from '../src/store/tripStore';
import { apiFetch } from '../src/services/api';

export default function AIPlannerScreen() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TripPlanResponse | null>(null);

  const updateActivity = (dayIndex: number, actIndex: number, newValue: string) => {
    if (!result) return;
    const newItinerary = [...result.dayWiseItinerary];
    newItinerary[dayIndex].activities[actIndex] = newValue;
    setResult({ ...result, dayWiseItinerary: newItinerary });
  };

  const removeActivity = (dayIndex: number, actIndex: number) => {
    if (!result) return;
    const newItinerary = [...result.dayWiseItinerary];
    newItinerary[dayIndex].activities.splice(actIndex, 1);
    setResult({ ...result, dayWiseItinerary: newItinerary });
  };

  const addActivity = (dayIndex: number) => {
    if (!result) return;
    const newItinerary = [...result.dayWiseItinerary];
    newItinerary[dayIndex].activities.push("New Activity");
    setResult({ ...result, dayWiseItinerary: newItinerary });
  };

  const generateTrip = async () => {
    if (!prompt.trim()) {
      Alert.alert('Hold on!', 'Please tell us what kind of trip you want.');
      return;
    }
    
    // Hide keyboard
    Keyboard.dismiss();
    setLoading(true);
    
    try {
      const plan = await generateTripPlan(prompt);
      setResult(plan);
    } catch (err: any) {
      Alert.alert('Plan Generation Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const acceptAndEdit = async () => {
    if (!result) return;
    try {
      setLoading(true);
      const days = result.stops.reduce((acc, stop) => acc + stop.days, 0);
      const endDate = new Date(Date.now() + (days > 0 ? days : 1) * 24 * 60 * 60 * 1000);
      
      const payload = {
        title: result.tripTitle,
        description: result.summary,
        startDate: new Date().toISOString(),
        endDate: endDate.toISOString(),
        estimatedTotalCost: result.totalEstimatedCost,
      };
      
      const tripId = await useTripStore.getState().createTrip(payload);
      
      let currentStartDate = new Date();
      for (let i = 0; i < result.stops.length; i++) {
        const stopPlan = result.stops[i];
        const stopEndDate = new Date(currentStartDate.getTime() + (stopPlan.days * 24 * 60 * 60 * 1000));
        
        try {
          const stopRes = await apiFetch(`/api/trips/${tripId}/stops`, {
            method: 'POST',
            body: JSON.stringify({
              city: stopPlan.city,
              country: stopPlan.city,
              startDate: currentStartDate.toISOString(),
              endDate: stopEndDate.toISOString(),
              order: i
            })
          });
          
          const stopId = stopRes.data._id;
          
          const daysForStop = result.dayWiseItinerary.filter(d => 
             d.city.toLowerCase().includes(stopPlan.city.toLowerCase()) || 
             stopPlan.city.toLowerCase().includes(d.city.toLowerCase())
          );
          
          for (const dayPlan of daysForStop) {
            for (const activityTitle of dayPlan.activities) {
              await apiFetch(`/api/trips/${tripId}/stops/${stopId}/activities`, {
                method: 'POST',
                body: JSON.stringify({
                  title: activityTitle,
                  description: 'AI recommended activity',
                  date: currentStartDate.toISOString()
                })
              });
            }
          }
        } catch (postErr) {
          console.warn("Failed to save stop/activity:", postErr);
        }
        
        currentStartDate = stopEndDate;
      }
      
      Alert.alert('Success', 'Trip created from AI plan!', [
        { text: 'View on Dashboard', onPress: () => router.push('/(tabs)') }
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper className="bg-white">
      <View className="px-6 pt-4 pb-4 border-b border-gray-100 flex-row items-center z-10 bg-white">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 mr-3">
          <MaterialIcons name="close" size={24} color="#4B5563" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">AI Trip Planner</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {!result ? (
          <View>
            <View className="w-16 h-16 bg-purple-100 rounded-3xl items-center justify-center mb-6">
              <Text className="text-3xl">✨</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
              Let's plan your dream trip.
            </Text>
            <Text className="text-gray-500 mb-8 text-base">
              Tell me where you want to go, your budget, and what you love doing. I'll create a full itinerary.
            </Text>

            <View className="bg-gray-50 rounded-3xl p-4 border border-gray-200 mb-8 min-h-[200px]">
              <TextInput
                className="flex-1 text-base text-gray-900 font-medium"
                placeholder="e.g., Plan a 7-day trip from Delhi to Goa and Mumbai under ₹40,000 focused on beaches, food and sightseeing..."
                placeholderTextColor="#9CA3AF"
                multiline
                textAlignVertical="top"
                value={prompt}
                onChangeText={setPrompt}
                editable={!loading}
              />
            </View>

            <PrimaryButton 
              title={loading ? "Generating Magic..." : "Generate Itinerary"} 
              onPress={generateTrip} 
              className="bg-primary shadow-primary/30"
              loading={loading}
              activeOpacity={0.9}
            />
            {loading && (
              <Text className="text-center text-gray-400 mt-4 animate-pulse">
                Analyzing destinations and crunching numbers...
              </Text>
            )}
          </View>
        ) : (
          <View>
            <View className="bg-purple-600 rounded-3xl p-6 mb-8 shadow-md shadow-primary/30">
              <View className="flex-row items-center space-x-2 mb-4">
                <Text className="text-2xl">✨</Text>
                <Text className="text-white text-xl font-bold ml-2">{result.tripTitle}</Text>
              </View>
              <Text className="text-purple-100 text-sm mb-6 leading-6">
                {result.summary}
              </Text>
              
              <View className="bg-white/20 rounded-2xl p-4 mb-3 flex-row items-center space-x-3">
                <Ionicons name="map" size={24} color="white" />
                <View className="ml-3">
                  <Text className="text-purple-100 text-xs text-left mb-1">Route</Text>
                  <Text className="text-white font-bold">{result.travelOrder.join(' → ')}</Text>
                </View>
              </View>
              
              <View className="bg-white/20 rounded-2xl p-4 flex-row items-center space-x-3">
                <Ionicons name="wallet" size={24} color="white" />
                <View className="ml-3">
                  <Text className="text-purple-100 text-xs text-left mb-1">Est. Total Cost</Text>
                  <Text className="text-white font-bold">{result.currency} {result.totalEstimatedCost.toLocaleString()}</Text>
                </View>
              </View>
            </View>

            <SectionHeader title="City Distribution" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8 -mx-6 px-6">
              {result.stops.map((stop, idx) => (
                <View key={idx} className="bg-white border border-gray-200 p-4 rounded-2xl mr-4 w-32 items-center">
                  <Ionicons name="location" size={28} color="#7C3AED" className="mb-2" />
                  <Text className="text-gray-900 font-bold mb-1 mt-2" numberOfLines={1}>{stop.city}</Text>
                  <Text className="text-gray-500 text-sm">{stop.days} Days</Text>
                </View>
              ))}
            </ScrollView>

            <SectionHeader title="Day-by-Day Itinerary (Editable Preview)" />
            <View className="mb-8 pl-2 border-l-2 border-gray-200 ml-4">
              {result.dayWiseItinerary.map((day, idx) => (
                <View key={idx} className="mb-6 relative pl-6">
                  <View className="absolute -left-[14px] top-1 w-6 h-6 bg-purple-100 rounded-full border border-primary items-center justify-center">
                    <View className="w-2 h-2 bg-primary rounded-full" />
                  </View>
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-primary font-bold text-sm">DAY {day.day} • {day.city}</Text>
                    <TouchableOpacity onPress={() => addActivity(idx)} className="bg-purple-50 px-2 py-1 rounded-md">
                      <Text className="text-primary text-xs font-bold">+ Add</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {day.activities.map((act, actIdx) => (
                    <View key={actIdx} className="flex-row items-center mb-2 bg-gray-50 rounded-lg p-1 border border-gray-100">
                      <Text className="font-bold text-gray-400 mx-2">•</Text>
                      <TextInput 
                        className="flex-1 text-gray-700 text-sm py-1"
                        value={act}
                        onChangeText={(val) => updateActivity(idx, actIdx, val)}
                        multiline
                      />
                      <TouchableOpacity onPress={() => removeActivity(idx, actIdx)} className="p-2">
                         <MaterialIcons name="close" size={16} color="#9CA3AF" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ))}
            </View>

            <View className="flex-row space-x-4 mt-2">
              <View className="flex-1 mr-2">
                <PrimaryButton 
                  title="Retry" 
                  onPress={() => setResult(null)} 
                  className="bg-gray-100 shadow-none border border-gray-200 w-full"
                  textClassName="text-gray-900"
                />
              </View>
              <View className="flex-1 ml-2">
                <PrimaryButton 
                  title="Accept & Save" 
                  onPress={acceptAndEdit} 
                  className="bg-primary shadow-primary/30 w-full"
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}
