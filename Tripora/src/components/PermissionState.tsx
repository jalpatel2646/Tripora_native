import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Button from './Button';
import * as Linking from 'expo-linking';

interface PermissionStateProps {
  title: string;
  description: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  onRetry?: () => void;
}

export default function PermissionState({ 
  title, 
  description, 
  icon = 'security', 
  onRetry 
}: PermissionStateProps) {
  const { colors, spacing, typography, radius } = useTheme();

  return (
    <View style={[styles.container, { paddingVertical: spacing.huge, paddingHorizontal: spacing.xxl }]}>
      <View style={[
        styles.iconContainer, 
        { backgroundColor: colors.warning + '15', marginBottom: spacing.xxl }
      ]}>
        <MaterialIcons name={icon} size={48} color={colors.warning} />
      </View>
      
      <Text style={[
        styles.title, 
        { color: colors.text, fontSize: typography.sizes.xxl, marginBottom: spacing.sm }
      ]}>
        {title}
      </Text>
      
      <Text style={[
        styles.description, 
        { color: colors.textSecondary, fontSize: typography.sizes.md, marginBottom: spacing.xxxl }
      ]}>
        {description}
      </Text>
      
      <View style={styles.actionContainer}>
        {onRetry && (
          <Button 
            title="Try Again" 
            onPress={onRetry} 
            style={{ marginBottom: spacing.md }}
          />
        )}
        <Button 
          title="Open Settings" 
          variant="outline" 
          onPress={() => Linking.openSettings()} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
  actionContainer: {
    width: '100%',
  }
});
