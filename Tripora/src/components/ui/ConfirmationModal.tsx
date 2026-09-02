import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown, ZoomIn, ZoomOut } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const { colors, radius, spacing, typography } = useTheme();

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="none" onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={isLoading ? undefined : onCancel}>
        <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
          <TouchableWithoutFeedback>
            <Animated.View 
              entering={ZoomIn.duration(250).springify()} 
              exiting={ZoomOut.duration(200)} 
              style={[
                styles.modalContainer, 
                { 
                  backgroundColor: colors.surface,
                  borderRadius: radius.xl,
                  padding: spacing.xl,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.25,
                  shadowRadius: 20,
                  elevation: 10,
                }
              ]}
            >
              <Text style={{ 
                fontSize: typography.sizes.xl, 
                fontWeight: '700', 
                color: colors.text,
                marginBottom: spacing.md,
                textAlign: 'center'
              }}>
                {title}
              </Text>
              
              <Text style={{ 
                fontSize: typography.sizes.md, 
                color: colors.textSecondary,
                marginBottom: spacing.xl,
                textAlign: 'center',
                lineHeight: 24,
              }}>
                {message}
              </Text>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[
                    styles.button, 
                    styles.cancelButton,
                    { backgroundColor: colors.surface } // Assuming surface is slightly different from card
                  ]} 
                  onPress={onCancel}
                  disabled={isLoading}
                >
                  <Text style={{ color: colors.textSecondary, fontWeight: '600', fontSize: typography.sizes.md }}>
                    {cancelText}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[
                    styles.button, 
                    styles.confirmButton,
                    { backgroundColor: isDestructive ? colors.error : colors.primary }
                  ]} 
                  onPress={onConfirm}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: typography.sizes.md }}>
                      {confirmText}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  confirmButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  }
});
