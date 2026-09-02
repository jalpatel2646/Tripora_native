import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface EmptyStateProps {
  title: string;
  description: string;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  actionTitle?: string;
  onActionPress?: () => void;
}

export default function EmptyState({ 
  title, 
  description, 
  iconName = 'flight-takeoff', 
  actionTitle, 
  onActionPress 
}: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <Animated.View 
      entering={FadeInDown.duration(600).springify()}
      className="flex-1 justify-center items-center py-12 px-6 bg-white rounded-3xl border border-gray-100 shadow-sm mt-2"
    >
      <View 
        className="mb-8 rounded-full p-8 items-center justify-center"
        style={{ backgroundColor: colors.primary + '15' }}
      >
        <MaterialIcons name={iconName} size={56} color={colors.primary} />
      </View>
      
      <Text className="text-2xl font-bold text-gray-900 text-center mb-3">
        {title}
      </Text>
      
      <Text className="text-base text-gray-500 text-center mb-8 px-4 leading-6">
        {description}
      </Text>
      
      {actionTitle && onActionPress && (
        <TouchableOpacity 
          onPress={onActionPress}
          activeOpacity={0.8}
          className="w-full py-4 px-6 rounded-2xl flex-row justify-center items-center shadow-sm"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-white font-bold text-lg">{actionTitle}</Text>
          <MaterialIcons name="arrow-forward" size={20} color="white" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}
