import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, ActivityIndicator, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  loading?: boolean;
}

export default function Button({ 
  title, 
  variant = 'primary', 
  loading = false, 
  style, 
  disabled, 
  ...props 
}: ButtonProps) {
  const { colors, typography, radius } = useTheme();

  const getBackgroundColor = () => {
    if (disabled && variant !== 'ghost') return colors.disabled;
    switch (variant) {
      case 'primary': return colors.primary;
      case 'secondary': return colors.textSecondary; // Or a specific secondary color
      case 'outline': return 'transparent';
      case 'danger': return colors.error;
      case 'ghost': return 'transparent';
      default: return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled && variant === 'ghost') return colors.disabled;
    switch (variant) {
      case 'primary': 
      case 'secondary':
      case 'danger':
        return '#FFFFFF';
      case 'outline': 
      case 'ghost':
        return disabled ? colors.disabled : colors.primary;
      default: return '#FFFFFF';
    }
  };

  const getBorder = () => {
    if (variant === 'outline') {
      return {
        borderWidth: 1,
        borderColor: disabled ? colors.disabled : colors.primary,
      };
    }
    return {};
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={isDisabled}
      style={[
        {
          backgroundColor: getBackgroundColor(),
          paddingVertical: 14,
          paddingHorizontal: 24,
          borderRadius: radius.md,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          minHeight: 52, // Preserve dimensions
        },
        getBorder(),
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text
          style={{
            color: getTextColor(),
            fontSize: typography.sizes.md,
            fontWeight: typography.weights.bold,
          }}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
