import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface TimelineItemProps {
  time: string;
  title: string;
  description?: string;
  isLast?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  cost?: number;
  onLongPress?: () => void;
  isActive?: boolean;
}

export default function TimelineItem({ 
  time, 
  title, 
  description, 
  isLast = false, 
  onEdit, 
  onDelete, 
  cost,
  onLongPress,
  isActive 
}: TimelineItemProps) {
  
  return (
    <View className="flex-row w-full flex-1">
      {/* Timeline Indicator */}
      <View className="w-16 items-center">
        <Text className="text-xs font-bold text-gray-900">{time}</Text>
        <View className="items-center justify-center mt-2 z-10 w-4 h-4 rounded-full bg-primary mb-1">
           <View className="w-2 h-2 rounded-full bg-white" />
        </View>
        {!isLast && <View className="w-[2px] flex-1 bg-gray-200 mt-[-4px]" />}
      </View>

      {/* Content */}
      <TouchableOpacity 
        activeOpacity={0.8}
        onLongPress={onLongPress}
        disabled={isActive}
        style={{ flex: 1, marginBottom: 24 }}
      >
        <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 16, padding: 16, borderColor: '#F3F4F6', borderWidth: 1, opacity: isActive ? 0.6 : 1, transform: [{ scale: isActive ? 1.02 : 1 }], elevation: isActive ? 5 : 0, shadowColor: '#000', shadowOpacity: isActive ? 0.2 : 0, shadowRadius: 5 }}>
          <View className="flex-row justify-between items-start mb-1">
            <Text className="text-base font-bold text-gray-900 flex-1">{title}</Text>
            {cost !== undefined && cost > 0 && (
              <Text className="text-xs font-bold text-primary bg-purple-50 px-2 py-1 rounded-md ml-2">
                ${cost.toFixed(2)}
              </Text>
            )}
          </View>
          
          {description ? (
            <Text className="text-sm text-gray-600 mb-2 leading-tight">{description}</Text>
          ) : null}

          <View className="flex-row justify-end mt-2 space-x-2">
             {onEdit && (
               <TouchableOpacity onPress={onEdit} className="p-1">
                 <MaterialIcons name="edit" size={16} color="#9CA3AF" />
               </TouchableOpacity>
             )}
             {onDelete && (
               <TouchableOpacity onPress={onDelete} className="p-1 ml-2">
                 <MaterialIcons name="delete" size={16} color="#EF4444" />
               </TouchableOpacity>
             )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
