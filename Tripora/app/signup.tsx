import { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, handleApiResponse } from '../src/services/api';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenWrapper from '../src/components/ScreenWrapper';
import InputField from '../src/components/InputField';
import PrimaryButton from '../src/components/PrimaryButton';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupScreen() {
  const router = useRouter();
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
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.fullName, email: data.email, password: data.password }),
      });

      const responseData = await handleApiResponse(response);

      await AsyncStorage.setItem('userToken', responseData.token);
      await AsyncStorage.setItem('userData', JSON.stringify(responseData.user));

      Alert.alert('Account Created', 'Welcome to Tripora!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    } catch (error: any) {
      Alert.alert('Signup Error', error.message || 'Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper className="justify-center px-6">
      <View className="mb-10 items-center">
        <View className="w-20 h-20 bg-emerald-100 rounded-full items-center justify-center mb-4">
          <MaterialIcons name="person-add" size={40} color="#10B981" />
        </View>
        <Text className="text-3xl font-bold text-gray-900">Create Account</Text>
        <Text className="text-gray-500 mt-2 text-center">
          Join Tripora and start planning your next adventure today.
        </Text>
      </View>

      <View className="w-full">
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

        <View className="mt-4">
          <PrimaryButton title="Sign Up" className="bg-emerald-500 shadow-emerald-200" onPress={handleSubmit(onSubmit)} loading={loading} />
        </View>

        <View className="flex-row justify-center mt-8">
          <Text className="text-gray-600">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-blue-600 font-bold">Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}
