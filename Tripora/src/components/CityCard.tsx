import { View, Text, Image, TouchableOpacity } from 'react-native';

interface CityCardProps {
  city: {
    id: string;
    name: string;
    country: string;
    imageUrl: string;
  };
}

export default function CityCard({ city }: CityCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="bg-white rounded-2xl shadow-sm overflow-hidden mr-4 border border-gray-100 w-36"
    >
      <Image source={{ uri: city.imageUrl }} className="w-full h-24" resizeMode="cover" />
      <View className="p-3">
        <Text className="text-base font-bold text-gray-900 mb-1" numberOfLines={1}>{city.name}</Text>
        <Text className="text-xs text-gray-500" numberOfLines={1}>{city.country}</Text>
      </View>
    </TouchableOpacity>
  );
}
