import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import Animated, { FadeInRight } from 'react-native-reanimated';

interface CityCardProps {
  city: {
    id: string;
    name: string;
    country: string;
    imageUrl: string;
    reason?: string;
  };
  index?: number;
}

export default function CityCard({ city, index = 0 }: CityCardProps) {
  return (
    <Animated.View entering={FadeInRight.delay(index * 100).duration(400)}>
      <TouchableOpacity
        activeOpacity={0.8}
        className="rounded-3xl shadow-sm mr-4 w-44 h-60 overflow-hidden bg-gray-100"
        style={{
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.05)',
        }}
      >
        <Image 
          source={city.imageUrl} 
          style={{ width: '100%', height: '100%' }} 
          contentFit="cover" 
          transition={500}
        />
        <View 
          className="absolute inset-0 justify-end p-4" 
          style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
        >
          <Text className="text-lg font-bold text-white mb-1" numberOfLines={1}>{city.name}</Text>
          <Text className="text-xs text-gray-200 font-medium mb-1" numberOfLines={1}>{city.country}</Text>
          {city.reason && (
             <Text className="text-[10px] text-white/90 italic leading-tight" numberOfLines={2}>{city.reason}</Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
