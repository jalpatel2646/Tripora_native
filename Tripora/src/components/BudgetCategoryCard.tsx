import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface BudgetCategoryCardProps {
  title: string;
  amount: number;
  iconName: keyof typeof MaterialIcons.glyphMap;
  color: string;
  percentage: number;
  onAmountChange?: (val: number) => void;
}

export default function BudgetCategoryCard({ title, amount, iconName, color, percentage, onAmountChange }: BudgetCategoryCardProps) {
  return (
    <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-3 flex-row items-center">
      <View style={{ backgroundColor: color + '20' }} className="w-12 h-12 rounded-full items-center justify-center mr-4">
        <MaterialIcons name={iconName} size={24} color={color} />
      </View>
      <View className="flex-1">
        <Text className="text-base font-bold text-gray-900">{title}</Text>
        <Text className="text-sm text-gray-500">{percentage.toFixed(0)}% of total</Text>
      </View>
      <View className="items-end flex-row">
        <Text className="text-base font-bold text-gray-900 mr-2">$</Text>
        <TextInput 
          value={amount.toString()}
          onChangeText={(text) => {
            if (onAmountChange) onAmountChange(Number(text) || 0);
          }}
          keyboardType="numeric"
          className="text-base font-bold text-gray-900 text-right w-16 bg-gray-50 p-1 rounded-md border border-gray-200"
        />
      </View>
    </View>
  );
}
