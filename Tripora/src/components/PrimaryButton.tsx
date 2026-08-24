import { Text, TouchableOpacity, TouchableOpacityProps, ActivityIndicator } from 'react-native';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  textClassName?: string;
}

export default function PrimaryButton({ title, loading = false, className = '', textClassName = 'text-white', ...props }: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={loading || props.disabled}
      className={`w-full bg-blue-600 py-3.5 rounded-2xl items-center justify-center flex-row shadow-md shadow-blue-200 ${
        loading || props.disabled ? 'opacity-70' : 'opacity-100'
      } ${className}`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className={`font-bold text-lg ${textClassName}`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
