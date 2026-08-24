import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Activity } from '../data/mockData';

interface ActivityCardProps {
  activity: Activity;
  isAdded: boolean;
  onToggle: () => void;
}

export default function ActivityCard({ activity, isAdded, onToggle }: ActivityCardProps) {
  return (
    <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
       <Image source={{ uri: activity.imageUrl }} className="w-full h-40" resizeMode="cover" />
       
       <View className="p-4">
         <View className="flex-row justify-between items-start mb-2">
           <View className="flex-1 pr-2">
             <Text className="text-lg font-bold text-gray-900">{activity.title}</Text>
             <View className="flex-row space-x-2 mt-1">
                <Text className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{activity.type}</Text>
                <Text className="text-xs text-primary font-medium bg-purple-50 px-2 py-0.5 rounded-full ml-2">
                  ${activity.estimatedCost.toFixed(2)}
                </Text>
                <Text className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full ml-2">
                  {activity.duration}
                </Text>
             </View>
           </View>
           
           <TouchableOpacity 
             onPress={onToggle}
             className={`p-2 rounded-full border ${
               isAdded ? 'bg-red-50 border-red-100' : 'bg-primary border-primary'
             }`}
           >
             <MaterialIcons 
               name={isAdded ? "remove" : "add"} 
               size={24} 
               color={isAdded ? "#EF4444" : "white"} 
             />
           </TouchableOpacity>
         </View>
         
         <Text className="text-sm text-gray-600 mt-2 leading-tight">
           {activity.description}
         </Text>
       </View>
    </View>
  );
}
