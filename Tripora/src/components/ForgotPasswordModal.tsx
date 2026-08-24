import { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Alert } from 'react-native';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialIcons } from '@expo/vector-icons';
import InputField from './InputField';
import PrimaryButton from './PrimaryButton';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ visible, onClose }: ForgotPasswordModalProps) {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Reset Link Sent', `Instructions have been sent to ${data.email}`, [
        {
          text: 'OK',
          onPress: () => {
            reset();
            onClose();
          },
        },
      ]);
    }, 1500);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl p-6 h-3/4">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-gray-900">Reset Password</Text>
            <TouchableOpacity onPress={onClose} className="p-2 rounded-full bg-gray-100">
              <MaterialIcons name="close" size={24} color="#4B5563" />
            </TouchableOpacity>
          </View>
          
          <Text className="text-gray-500 mb-8">
            Enter the email address associated with your account, and we'll send you a link to reset your password.
          </Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
               <InputField
                 label="Email Address"
                 placeholder="Enter your email"
                 keyboardType="email-address"
                 autoCapitalize="none"
                 value={value}
                 onChangeText={onChange}
                 error={errors.email?.message}
               />
            )}
          />

          <View className="mt-4">
            <PrimaryButton title="Send Reset Link" onPress={handleSubmit(onSubmit)} loading={loading} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
