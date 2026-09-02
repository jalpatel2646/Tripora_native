import React, { useState } from 'react';
import { View, TextInput, Text, TextInputProps, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
}

export default function Input({
  label,
  error,
  helperText,
  icon,
  secureTextEntry,
  style,
  ...props
}: InputProps) {
  const { colors, typography, radius, spacing } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPassword = secureTextEntry;

  return (
    <View style={{ marginBottom: spacing.lg, width: '100%' }}>
      {label && (
        <Text style={{ 
          color: colors.text, 
          fontSize: typography.sizes.sm,
          fontWeight: typography.weights.medium,
          marginBottom: spacing.xs 
        }}>
          {label}
        </Text>
      )}

      <View
        style={[{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: error ? colors.error : isFocused ? colors.primary : colors.border,
          borderRadius: radius.md,
          minHeight: 52,
          paddingHorizontal: spacing.md,
        }, style]}
      >
        {icon && (
          <MaterialIcons 
            name={icon} 
            size={20} 
            color={error ? colors.error : isFocused ? colors.primary : colors.textSecondary} 
            style={{ marginRight: spacing.sm }}
          />
        )}

        <TextInput
          style={{
            flex: 1,
            color: colors.text,
            fontSize: typography.sizes.md,
            height: '100%',
          }}
          placeholderTextColor={colors.textSecondary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !isPasswordVisible}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity 
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={{ padding: spacing.xs }}
          >
            <MaterialIcons 
              name={isPasswordVisible ? 'visibility' : 'visibility-off'} 
              size={20} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
        )}
      </View>

      {error ? (
        <Text style={{ 
          color: colors.error, 
          fontSize: typography.sizes.xs, 
          marginTop: spacing.xs 
        }}>
          {error}
        </Text>
      ) : helperText ? (
        <Text style={{ 
          color: colors.textSecondary, 
          fontSize: typography.sizes.xs, 
          marginTop: spacing.xs 
        }}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}
