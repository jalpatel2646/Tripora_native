import React from 'react';
import { TextInputProps, View } from 'react-native';
import Input from './Input';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export default function InputField({ label, error, className = '', ...props }: InputFieldProps) {
  // Maintaining wrapper for backward compatibility with className
  return (
    <View className={className}>
      <Input label={label} error={error} {...props} />
    </View>
  );
}
