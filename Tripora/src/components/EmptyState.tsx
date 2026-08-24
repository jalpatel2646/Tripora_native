import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import PrimaryButton from './PrimaryButton';

interface EmptyStateProps {
  title: string;
  description: string;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  actionTitle?: string;
  onActionPress?: () => void;
}

export default function EmptyState({ title, description, iconName = 'flight-takeoff', actionTitle, onActionPress }: EmptyStateProps) {
  return (
    <View className="flex-1 justify-center items-center py-10 px-6 mt-10">
      <View className="w-24 h-24 bg-purple-50 rounded-full items-center justify-center mb-6">
        <MaterialIcons name={iconName} size={48} color="#7C3AED" />
      </View>
      <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">{title}</Text>
      <Text className="text-gray-500 text-center mb-8">{description}</Text>
      
      {actionTitle && onActionPress && (
        <View className="w-full">
          <PrimaryButton title={actionTitle} onPress={onActionPress} />
        </View>
      )}
    </View>
  );
}
