import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenWrapper from '../../src/components/ScreenWrapper';
import TripCard from '../../src/components/TripCard';
import CityCard from '../../src/components/CityCard';
import SectionHeader from '../../src/components/SectionHeader';
import PrimaryButton from '../../src/components/PrimaryButton';
import { MOCK_TRIPS, MOCK_CITIES, MOCK_BUDGET } from '../../src/services/mockData';
import { MaterialIcons } from '@expo/vector-icons';

const PREFERENCES = ['Beach', 'Adventure', 'Food', 'History', 'Nature', 'Nightlife'];

export default function DashboardScreen() {
  const router = useRouter();
  const [preferences, setPreferences] = useState<string[]>([]);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const saved = await AsyncStorage.getItem('userPreferences');
        if (saved) setPreferences(JSON.parse(saved));
      } catch (e) {}
    };
    loadPreferences();
  }, []);

  const togglePreference = async (pref: string) => {
    const newPrefs = preferences.includes(pref) ? preferences.filter(p => p !== pref) : [...preferences, pref];
    setPreferences(newPrefs);
    try {
      await AsyncStorage.setItem('userPreferences', JSON.stringify(newPrefs));
    } catch (e) {}
  };

  const displayCities = preferences.length > 0 
    ? MOCK_CITIES.filter(city => preferences.some(pref => city.tags?.includes(pref)))
    : MOCK_CITIES;

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        <View className="mb-8 mt-4 flex-row justify-between items-center">
          <View>
            <Image 
              source={require('../../assets/logo.png')} 
              style={{ width: 140, height: 48, marginBottom: 4 }} 
              resizeMode="contain" 
            />
            <Text className="text-3xl font-bold text-gray-900 leading-tight">Welcome back, Alex!</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/camera')} className="w-14 h-14 bg-white rounded-full shadow-sm border border-gray-100 items-center justify-center">
            <MaterialIcons name="camera-alt" size={28} color="#7C3AED" />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center justify-between space-x-4 mb-10 w-full">
          <View className="flex-1 mr-2">
            <PrimaryButton 
              title="Manual Plan" 
              onPress={() => router.push('/trips/new')}
              className="bg-gray-100 shadow-none border border-gray-200 w-full"
              textClassName="text-gray-900"
              activeOpacity={0.9}
            />
          </View>
          <View className="flex-1 ml-2">
            <PrimaryButton 
              title="✨ AI Plan Trip" 
              onPress={() => router.push('/ai-planner')}
              className="bg-primary shadow-primary/30 w-full"
              activeOpacity={0.9}
            />
          </View>
        </View>

        <View className="mb-10">
          <SectionHeader 
            title="Recent & Upcoming" 
            actionTitle="View All" 
            onActionPress={() => router.push('/(tabs)/trips')} 
          />
          {MOCK_TRIPS.length > 0 ? (
            MOCK_TRIPS.map(trip => (
              <TripCard key={trip.id} trip={trip} />
            ))
          ) : (
            <Text className="text-gray-500 text-center py-4">No upcoming trips.</Text>
          )}
        </View>

        <View className="mb-10">
          <SectionHeader title={preferences.length > 0 ? "For You" : "Discover"} />
          <Text className="text-gray-500 text-sm mb-4">What's your vibe for the next trip?</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 -mx-6 px-6">
            {PREFERENCES.map(pref => {
              const isActive = preferences.includes(pref);
              return (
                <TouchableOpacity
                  key={pref}
                  onPress={() => togglePreference(pref)}
                  className={`px-4 py-2 rounded-full border mr-3 ${isActive ? 'bg-primary border-primary' : 'bg-white border-gray-200'}`}
                >
                  <Text className={`font-medium ${isActive ? 'text-white' : 'text-gray-600'}`}>{pref}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6">
            {displayCities.map(city => (
              <CityCard key={city.id} city={city} />
            ))}
          </ScrollView>
        </View>

        <View className="mb-6">
          <SectionHeader title="Budget Highlights" />
          <View className="flex-row space-x-4">
            <View className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mb-3">
                <MaterialIcons name="account-balance-wallet" size={20} color="#10B981" />
              </View>
              <Text className="text-gray-500 text-sm mb-1">Total Planned</Text>
              <Text className="text-xl font-bold text-gray-900">${MOCK_BUDGET.totalAllocated}</Text>
            </View>
            <View className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mb-3">
                <MaterialIcons name="pie-chart" size={20} color="#7C3AED" />
              </View>
              <Text className="text-gray-500 text-sm mb-1">Avg Per Day</Text>
              <Text className="text-xl font-bold text-gray-900">${MOCK_BUDGET.averagePerDay}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
