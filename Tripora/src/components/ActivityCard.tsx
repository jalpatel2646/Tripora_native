import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { openNavigation } from '../utils/navigationUtils';
import { locationService } from '../services/locationService';

interface ActivityCardProps {
  activity: any;
  isAdded: boolean;
  onToggle: () => void;
}

export default function ActivityCard({ activity, isAdded, onToggle }: ActivityCardProps) {
  const [navigating, setNavigating] = React.useState(false);

  const handleNavigate = async () => {
    setNavigating(true);
    try {
      // coordinates if not available on the schema can be geocoded
      let lat = (activity as any).latitude;
      let lng = (activity as any).longitude;

      if (!lat || !lng) {
        const coords = await locationService.geocode(activity.title);
        if (coords) {
          lat = coords.latitude;
          lng = coords.longitude;
        }
      }

      if (lat && lng) {
        await openNavigation(lat, lng, activity.title);
      } else {
        alert('Could not find coordinates for this activity.');
      }
    } finally {
      setNavigating(false);
    }
  };

  return (
    <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
       <Image source={{ uri: ((activity as any).imageUrl || activity.image || '') }} className="w-full h-40" resizeMode="cover" />
       
       <View className="p-4">
         <View className="flex-row justify-between items-start mb-2">
           <View className="flex-1 pr-2">
             <Text className="text-lg font-bold text-gray-900">{activity.title}</Text>
             <View className="flex-row space-x-2 mt-1">
                <Text className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{activity.type}</Text>
                <Text className="text-xs text-primary font-medium bg-purple-50 px-2 py-0.5 rounded-full ml-2">
                  ${(activity as any).estimatedCost ? (activity as any).estimatedCost.toFixed(2) : activity.cost}
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
           {(activity as any).description || 'Experience the beauty and culture of this amazing destination.'}
         </Text>

         <View className="flex-row items-center mt-3 border-t border-gray-100 pt-3">
           <TouchableOpacity 
             onPress={handleNavigate}
             disabled={navigating}
             className="flex-row items-center flex-1 justify-center bg-gray-50 py-2 rounded-lg"
           >
             <MaterialIcons name="navigation" size={18} color="#3B82F6" />
             <Text className="text-blue-500 font-medium ml-1">
               {navigating ? 'Locating...' : 'Navigate'}
             </Text>
           </TouchableOpacity>
         </View>
       </View>
    </View>
  );
}
