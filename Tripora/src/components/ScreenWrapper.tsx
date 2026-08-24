import { SafeAreaView } from 'react-native-safe-area-context';
import { ReactNode } from 'react';
import { ViewProps } from 'react-native';

interface ScreenWrapperProps extends ViewProps {
  children: ReactNode;
}

export default function ScreenWrapper({ children, className = '', ...props }: ScreenWrapperProps) {
  return (
    <SafeAreaView className={`flex-1 bg-gray-50 ${className}`} {...props}>
      {children}
    </SafeAreaView>
  );
}
