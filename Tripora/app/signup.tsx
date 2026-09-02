import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { apiFetch } from '../src/services/api';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenWrapper from '../src/components/ScreenWrapper';
import InputField from '../src/components/InputField';
import PrimaryButton from '../src/components/PrimaryButton';
import { useAuth } from '../src/context/AuthContext';
import { toast } from '../src/store/toastStore';
import { useTheme } from '../src/context/ThemeContext';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const { colors, typography, spacing } = useTheme();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    try {
      await register(data.fullName, data.email, data.password);
      toast.success('Account created successfully!');
      router.replace('/(tabs)');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper style={{ justifyContent: 'center', paddingHorizontal: spacing.xl }}>
      <View style={{ marginBottom: spacing.huge, alignItems: 'center' }}>
        <View style={{ 
          width: 80, height: 80, 
          backgroundColor: colors.success + '15', 
          borderRadius: 40, 
          alignItems: 'center', 
          justifyContent: 'center', 
          marginBottom: spacing.lg 
        }}>
          <MaterialIcons name="person-add" size={40} color={colors.success} />
        </View>
        <Text style={{ fontSize: typography.sizes.xxxl, fontWeight: typography.weights.bold, color: colors.text }}>
          Create Account
        </Text>
        <Text style={{ color: colors.textSecondary, marginTop: spacing.xs, textAlign: 'center' }}>
          Join Tripora and start planning your next adventure today.
        </Text>
      </View>

      <View style={{ width: '100%' }}>
        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Full Name"
              placeholder="Enter your name"
              value={value}
              onChangeText={onChange}
              error={errors.fullName?.message}
            />
          )}
        />

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
              placeholder="Create a password"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              error={errors.password?.message}
            />
          )}
        />

        <View style={{ marginTop: spacing.sm }}>
          <PrimaryButton 
            title="Sign Up" 
            onPress={handleSubmit(onSubmit)} 
            loading={loading} 
          />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xxxl }}>
          <Text style={{ color: colors.textSecondary }}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: colors.primary, fontWeight: typography.weights.bold }}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}

