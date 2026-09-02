import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

interface TripCardProps {
  trip: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    destinationsCount: number;
    imageUrl: string;
    budget?: string; // fallback
    estimatedTotalCost?: number;
    budgetLimit?: number;
    isOptimized?: boolean;
    savings?: number;
  };
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
  index?: number;
}

export default function TripCard({ trip, onEdit, onDelete, showActions = false, index = 0 }: TripCardProps) {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <Animated.View entering={FadeInUp.delay(index * 150).springify().mass(0.8)}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => router.push(`/trips/${trip.id}/builder`)}
        className="bg-white rounded-3xl shadow-md mb-6 w-[280px] mr-4 overflow-hidden border border-gray-100"
      >
        <View className="h-44 w-full relative">
          <Image 
            source={{ uri: trip.imageUrl }} 
            style={{ width: '100%', height: '100%' }} 
            contentFit="cover"
            transition={400}
          />
          <View className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded-full flex-row items-center">
            <MaterialIcons name="place" size={14} color={colors.primary} />
            <Text className="text-xs font-semibold text-gray-800 ml-1">
              {trip.destinationsCount} {trip.destinationsCount === 1 ? 'City' : 'Cities'}
            </Text>
          </View>

          <View className="absolute top-3 right-3 bg-black/30 px-2 py-1 rounded-full">
            <Text className="text-[10px] text-white font-medium">#{trip.id.split('-')[1] || trip.id}</Text>
          </View>
          
          {trip.isOptimized && (
            <View className="absolute bottom-3 left-3 bg-green-500/90 px-2 py-1 rounded-md flex-row items-center">
              <Text className="text-[10px] text-white font-bold">✨ AI Saved ${trip.savings}</Text>
            </View>
          )}
        </View>

        <View className="p-4">
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1 pr-2">
              <Text className="text-xl font-bold text-gray-900 mb-1" numberOfLines={1}>{trip.name}</Text>
              <Text className="text-sm font-medium text-gray-500">
                {trip.startDate} - {trip.endDate}
              </Text>
            </View>
            
            {showActions && (
              <View className="flex-row items-center space-x-1">
                {onEdit && (
                  <TouchableOpacity onPress={onEdit} className="p-2 bg-gray-50 rounded-full">
                    <MaterialIcons name="edit" size={18} color="#6B7280" />
                  </TouchableOpacity>
                )}
                {onDelete && (
                  <TouchableOpacity onPress={onDelete} className="p-2 bg-red-50 rounded-full">
                    <MaterialIcons name="delete-outline" size={18} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
          
          <View className="flex-row items-center justify-between pt-3 border-t border-gray-100 mt-1">
            <View className="flex-row items-center">
              <MaterialIcons name="account-balance-wallet" size={16} color="#9CA3AF" />
              <Text className="text-xs text-gray-500 ml-1.5 font-medium">Est. Cost</Text>
            </View>
            <View className="items-end">
              <Text className="text-sm font-bold" style={{ color: colors.primary }}>
                {trip.estimatedTotalCost !== undefined ? `$${trip.estimatedTotalCost.toLocaleString()}` : (trip.budget || 'Pending')}
              </Text>
              {(trip.budgetLimit ?? 0) > 0 && (
                 <Text className="text-[10px] text-gray-400 font-medium">of ${(trip.budgetLimit ?? 0).toLocaleString()}</Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
