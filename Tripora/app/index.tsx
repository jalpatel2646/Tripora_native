import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenWrapper from '../src/components/ScreenWrapper';
import InputField from '../src/components/InputField';
import PrimaryButton from '../src/components/PrimaryButton';
import { useAuth } from '../src/context/AuthContext';
import { apiFetch } from '../src/services/api';
import { toast } from '../src/store/toastStore';
import { useTheme } from '../src/context/ThemeContext';
import ForgotPasswordModal from '../src/components/ForgotPasswordModal';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const { colors, typography, spacing } = useTheme();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      router.replace('/(tabs)');
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper style={{ justifyContent: 'center', paddingHorizontal: spacing.xl }}>
      <View style={{ marginBottom: spacing.huge, alignItems: 'center' }}>
        <View style={{ 
          width: 80, height: 80, 
          backgroundColor: colors.primary + '15', 
          borderRadius: 40, 
          alignItems: 'center', 
          justifyContent: 'center', 
          marginBottom: spacing.lg 
        }}>
          <MaterialIcons name="flight" size={40} color={colors.primary} />
        </View>
        <Text style={{ fontSize: typography.sizes.xxxl, fontWeight: typography.weights.bold, color: colors.text }}>
          Tripora
        </Text>
        <Text style={{ color: colors.textSecondary, marginTop: spacing.xs, textAlign: 'center' }}>
          Your intelligent travel companion.
        </Text>
      </View>

      <View style={{ width: '100%' }}>
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

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              error={errors.password?.message}
            />
          )}
        />

        <TouchableOpacity 
          style={{ alignItems: 'flex-end', marginBottom: spacing.xl }}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ color: colors.primary, fontWeight: typography.weights.semibold }}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <PrimaryButton 
          title="Log In" 
          onPress={handleSubmit(onSubmit)} 
          loading={loading} 
        />

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xxxl }}>
          <Text style={{ color: colors.textSecondary }}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={{ color: colors.primary, fontWeight: typography.weights.bold }}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      {modalVisible && (
        <ForgotPasswordModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      )}
    </ScreenWrapper>
  );
}
