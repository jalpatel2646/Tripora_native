import { Text, TextInput, TextInputProps, View } from 'react-native';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export default function InputField({ label, error, className = '', ...props }: InputFieldProps) {
  return (
    <View className={`w-full mb-4 ${className}`}>
      <Text className="text-sm font-medium text-gray-700 mb-1 ml-1">{label}</Text>
      <TextInput
        placeholderTextColor="#9CA3AF"
        className={`w-full bg-white px-4 py-3 rounded-2xl border ${
          error ? 'border-red-500' : 'border-gray-200'
        } focus:border-blue-500 text-gray-900 shadow-sm`}
        {...props}
      />
      {error && <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>}
    </View>
  );
}
