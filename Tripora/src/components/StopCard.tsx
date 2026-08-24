import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CityStop } from '../data/mockData';

interface StopCardProps {
  stop: CityStop;
  onPress: () => void;
  onDelete: () => void;
  onDrag?: () => void;
  isActive?: boolean;
}

export default function StopCard({ stop, onPress, onDelete, onDrag, isActive = false }: StopCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      onLongPress={onDrag}
      className={`bg-white rounded-2xl shadow-sm overflow-hidden mb-3 border ${
        isActive ? 'border-primary shadow-primary/20' : 'border-gray-100 shadow-gray-200'
      }`}
    >
      <View className="px-5 py-4 flex-row items-center">
        {onDrag && (
          <TouchableOpacity onPressIn={onDrag} className="mr-3">
             <MaterialIcons name="drag-indicator" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        )}
        
        <View className="flex-1">
          <View className="flex-row items-center">
            <Text className="text-lg font-bold text-gray-900">{stop.cityName}</Text>
            <Text className="text-sm text-gray-500 ml-2">({stop.country})</Text>
          </View>
          <Text className="text-sm text-gray-500 mt-1">
            {stop.startDate} - {stop.endDate}
          </Text>
          <View className="flex-row items-center mt-2">
            <View className="bg-purple-50 px-2 py-1 rounded-full flex-row items-center">
               <MaterialIcons name="local-activity" size={14} color="#7C3AED" />
               <Text className="text-xs font-semibold text-primary ml-1">{stop.activitiesCount} Activities</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={onDelete} className="p-2 ml-2 bg-red-50 rounded-full">
           <MaterialIcons name="delete-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
