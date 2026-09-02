import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Button from './Button';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmTitle?: string;
  cancelTitle?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmTitle = 'Confirm',
  cancelTitle = 'Cancel',
  isDanger = false,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  const { colors, typography, radius, spacing } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={[styles.dialog, { 
          backgroundColor: colors.surface, 
          borderRadius: radius.lg,
          padding: spacing.xl
        }]}>
          <Text style={{ 
            color: colors.text, 
            fontSize: typography.sizes.xl,
            fontWeight: typography.weights.bold,
            marginBottom: spacing.sm
          }}>
            {title}
          </Text>
          
          <Text style={{ 
            color: colors.textSecondary, 
            fontSize: typography.sizes.md,
            marginBottom: spacing.xxl,
            lineHeight: 24
          }}>
            {message}
          </Text>
          
          <View style={styles.actions}>
            <View style={styles.buttonWrapper}>
              <Button 
                title={cancelTitle} 
                variant="outline" 
                onPress={onCancel} 
                style={{ paddingVertical: 10, minHeight: 44 }}
              />
            </View>
            <View style={[styles.buttonWrapper, { marginLeft: spacing.md }]}>
              <Button 
                title={confirmTitle} 
                variant={isDanger ? 'danger' : 'primary'} 
                onPress={onConfirm} 
                style={{ paddingVertical: 10, minHeight: 44 }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialog: {
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  buttonWrapper: {
    flex: 1,
  }
});
