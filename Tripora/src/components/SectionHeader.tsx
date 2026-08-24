import { View, Text, TouchableOpacity } from 'react-native';

interface SectionHeaderProps {
  title: string;
  actionTitle?: string;
  onActionPress?: () => void;
}

export default function SectionHeader({ title, actionTitle, onActionPress }: SectionHeaderProps) {
  return (
    <View className="flex-row justify-between items-center mb-4">
      <Text className="text-xl font-bold text-gray-900">{title}</Text>
      {actionTitle && onActionPress && (
        <TouchableOpacity onPress={onActionPress}>
          <Text className="text-primary font-medium">{actionTitle}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
