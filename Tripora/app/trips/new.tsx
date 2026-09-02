import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

import ScreenWrapper from '../../src/components/ScreenWrapper';
import InputField from '../../src/components/InputField';
import PrimaryButton from '../../src/components/PrimaryButton';
import { useCameraStore } from '../../src/store/cameraStore';
import { useLocation } from '../../src/hooks/useLocation';
import { useTheme } from '../../src/context/ThemeContext';
import { toast } from '../../src/store/toastStore';

const ALMOST_A_YEAR = new Date(new Date().setFullYear(new Date().getFullYear() + 2));

const tripSchema = z.object({
  name: z.string().min(3, 'Trip name must be at least 3 characters'),
  city: z.string().min(2, 'Starting city is required'),
  description: z.string().optional(),
  startDate: z.date({ error: 'Start date is required' }),
  endDate: z.date({ error: 'End date is required' }),
}).refine(data => data.endDate >= data.startDate, {
  message: 'End date cannot be earlier than start date',
  path: ['endDate'],
});

type TripFormData = z.infer<typeof tripSchema>;

export default function CreateTripScreen() {
  const router = useRouter();
  const { colors, spacing } = useTheme();
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Date picker state
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      city: '',
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    }
  });

  const { location, loading: locationLoading, fetchLocation } = useLocation();

  const handleUseCurrentLocation = async () => {
    const loc = await fetchLocation();
    if (loc && loc.city) {
      setValue('city', loc.city, { shouldValidate: true });
    }
  };

  const { capturedUri, activeMode, clearCapturedImage } = useCameraStore();
  
  useEffect(() => {
    if (activeMode === 'create_cover' && capturedUri) {
      setCoverImage(capturedUri);
      clearCapturedImage();
    }
  }, [activeMode, capturedUri]);

  const handleAddCover = () => {
    Alert.alert('Add Cover Photo', 'Choose how you want to add a cover photo.', [
      { text: 'Take Photo', onPress: () => router.push('/camera?mode=create_cover') },
      { text: 'Choose from Gallery', onPress: async () => {
         const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', allowsEditing: true, aspect: [16, 9], quality: 0.8 });
         if (!result.canceled) setCoverImage(result.assets[0].uri);
      }},
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  const onSubmit = (data: TripFormData) => {
    setLoading(true);
    // Simulate API save
    setTimeout(() => {
      setLoading(false);
      toast.success('Trip created successfully!');
      if (router.canGoBack()) router.back();
      else router.replace('/(tabs)/trips');
    }, 1200);
  };

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  return (
    <ScreenWrapper style={{ backgroundColor: colors.background }}>
      <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.background }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: spacing.sm, marginLeft: -spacing.sm }}>
          <MaterialIcons name="close" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>Plan New Trip</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <Text className="text-gray-500 mb-6">Fill in the details to start building your itinerary.</Text>

        <TouchableOpacity 
          onPress={() => router.push('/ai-planner')}
          className="w-full bg-purple-50 p-4 rounded-2xl border border-purple-200 mb-6 flex-row items-center"
          activeOpacity={0.8}
        >
          <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-4">
            <Text className="text-xl">✨</Text>
          </View>
          <View className="flex-1">
            <Text className="text-purple-900 font-bold mb-1">Feeling lazy?</Text>
            <Text className="text-purple-700 text-sm">Let our AI plan the perfect trip for you instantly.</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#7C3AED" />
        </TouchableOpacity>

        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={handleAddCover}
          className="w-full h-40 bg-gray-100 rounded-2xl items-center justify-center mb-6 overflow-hidden border border-gray-200 border-dashed"
        >
          {coverImage ? (
            <Image source={{ uri: coverImage }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <View className="items-center">
              <MaterialIcons name="add-a-photo" size={32} color="#9CA3AF" />
              <Text className="text-gray-500 mt-2 font-medium">Add Cover Photo (Optional)</Text>
            </View>
          )}
        </TouchableOpacity>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Trip Name"
              placeholder="e.g. Summer in Kyoto"
              value={value}
              onChangeText={onChange}
              error={errors.name?.message}
            />
          )}
        />

        <View className="mb-4">
          <Controller
            control={control}
            name="city"
            render={({ field: { onChange, value } }) => (
              <InputField
                label="Starting City"
                placeholder="Where does the trip start?"
                value={value}
                onChangeText={onChange}
                error={errors.city?.message}
              />
            )}
          />
          <TouchableOpacity 
            onPress={handleUseCurrentLocation} 
            className="flex-row items-center mt-2 pl-1"
            disabled={locationLoading}
          >
            <MaterialIcons name="my-location" size={16} color="#7C3AED" />
            <Text className="text-primary text-sm font-medium ml-1">
              {locationLoading ? 'Detecting...' : 'Use my current location'}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between mb-4 space-x-4">
          <View className="flex-1 mr-2">
            <Text className="text-sm font-medium text-gray-700 mb-1 ml-1">Start Date</Text>
            <TouchableOpacity 
              onPress={() => setShowStartPicker(true)}
              className="bg-white px-4 py-3 rounded-2xl border border-gray-200 justify-center h-14"
            >
              <Text className="text-gray-900">{format(startDate, 'MMM dd, yyyy')}</Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowStartPicker(Platform.OS === 'ios');
                  if (selectedDate) setValue('startDate', selectedDate, { shouldValidate: true });
                }}
              />
            )}
          </View>

          <View className="flex-1 ml-2">
            <Text className="text-sm font-medium text-gray-700 mb-1 ml-1">End Date</Text>
            <TouchableOpacity 
              onPress={() => setShowEndPicker(true)}
              className={`bg-white px-4 py-3 rounded-2xl border justify-center h-14 ${errors.endDate ? 'border-red-500' : 'border-gray-200'}`}
            >
              <Text className="text-gray-900">{format(endDate, 'MMM dd, yyyy')}</Text>
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                minimumDate={startDate}
                onChange={(event, selectedDate) => {
                  setShowEndPicker(Platform.OS === 'ios');
                  if (selectedDate) setValue('endDate', selectedDate, { shouldValidate: true });
                }}
              />
            )}
            {errors.endDate && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.endDate.message}</Text>}
          </View>
        </View>

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Description (Optional)"
              placeholder="What is this trip about?"
              value={value}
              onChangeText={onChange}
              multiline
              numberOfLines={4}
              className="h-32 text-top mt-2" 
              style={{ textAlignVertical: 'top' }}
            />
          )}
        />

        <View className="mt-8">
          <PrimaryButton 
            title="Create Trip" 
            onPress={handleSubmit(onSubmit)} 
            className="bg-primary shadow-primary/30"
            loading={loading}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
