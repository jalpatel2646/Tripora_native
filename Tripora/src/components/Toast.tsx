import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import Animated, { FadeInUp, FadeOutUp, Layout } from 'react-native-reanimated';
import { useToastStore, ToastType } from '../store/toastStore';
import { useTheme } from '../context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ToastItem = ({ message, type, id, onHide }: { message: string, type: ToastType, id: string, onHide: (id: string) => void }) => {
  const { colors, radius, spacing, typography } = useTheme();

  const getIcon = () => {
    switch (type) {
      case 'success': return 'check-circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success': return colors.success;
      case 'error': return colors.error;
      case 'warning': return colors.warning;
      case 'info': return colors.info;
    }
  };

  return (
    <Animated.View 
      entering={FadeInUp.duration(300).springify()} 
      exiting={FadeOutUp.duration(200)}
      layout={Layout.springify()}
      style={[
        styles.toast,
        { 
          backgroundColor: colors.surface, 
          borderColor: getColor(),
          borderLeftWidth: 4,
          borderRadius: radius.lg,
          padding: spacing.md, 
          paddingHorizontal: spacing.lg,
          marginBottom: spacing.sm,
          shadowColor: getColor(),
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 6,
        }
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: getColor() + '20' }]}>
        <MaterialIcons name={getIcon()} size={20} color={getColor()} />
      </View>
      <Text style={{ 
        flex: 1, 
        color: colors.text, 
        fontSize: typography.sizes.sm,
        fontWeight: '600',
        marginHorizontal: spacing.sm,
      }}>
        {message}
      </Text>
      <TouchableOpacity onPress={() => onHide(id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <MaterialIcons name="close" size={18} color={colors.textSecondary} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function ToastContainer() {
  const { toasts, hideToast } = useToastStore();
  const insets = useSafeAreaInsets();

  if (toasts.length === 0) return null;

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'android' ? insets.top + 10 : insets.top }]} pointerEvents="box-none">
      <View style={styles.innerContainer} pointerEvents="box-none">
        {toasts.map((toast) => (
          <ToastItem 
            key={toast.id} 
            {...toast} 
            onHide={hideToast}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    elevation: 9999,
  },
  innerContainer: {
    padding: 16,
    alignItems: 'center',
    width: '100%',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    maxWidth: 400,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
