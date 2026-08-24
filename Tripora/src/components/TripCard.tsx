import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface TripCardProps {
  trip: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    destinationsCount: number;
    imageUrl: string;
  };
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export default function TripCard({ trip, onEdit, onDelete, showActions = false }: TripCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push(`/trips/${trip.id}/builder`)}
      className="bg-white rounded-2xl shadow-sm shadow-gray-200 overflow-hidden mb-4 border border-gray-100"
    >
      <Image source={{ uri: trip.imageUrl }} className="w-full h-32" resizeMode="cover" />
      <View className="p-4">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-900 mb-1" numberOfLines={1}>{trip.name}</Text>
            <Text className="text-sm text-gray-500 mb-2">
              {trip.startDate} - {trip.endDate}
            </Text>
          </View>
          {showActions && (
            <View className="flex-row items-center space-x-2">
              {onEdit && (
                <TouchableOpacity onPress={onEdit} className="p-2 bg-gray-50 rounded-full ml-2">
                  <MaterialIcons name="edit" size={20} color="#6B7280" />
                </TouchableOpacity>
              )}
              {onDelete && (
                <TouchableOpacity onPress={onDelete} className="p-2 bg-red-50 rounded-full ml-2">
                  <MaterialIcons name="delete-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
        
        <View className="flex-row items-center mt-2">
          <MaterialIcons name="place" size={16} color="#7C3AED" />
          <Text className="text-xs text-primary font-medium ml-1">
            {trip.destinationsCount} {trip.destinationsCount === 1 ? 'Destination' : 'Destinations'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
