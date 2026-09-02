import React from 'react';
import { TouchableOpacityProps, View } from 'react-native';
import Button from './Button';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  textClassName?: string;
}

export default function PrimaryButton({ title, loading = false, className = '', textClassName, ...props }: PrimaryButtonProps) {
  // Maintaining wrapper for backward compatibility with className
  return (
    <View className={className}>
      <Button title={title} loading={loading} variant="primary" {...props as any} />
    </View>
  );
}
