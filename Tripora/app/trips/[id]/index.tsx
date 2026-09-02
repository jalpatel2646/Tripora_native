import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, StyleSheet, Alert, Image, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenWrapper from '../../../src/components/ScreenWrapper';
import { MOCK_ITINERARY_STOPS } from '../../../src/data/mockData';
import { MOCK_BUDGET } from '../../../src/services/mockData';
import SectionHeader from '../../../src/components/SectionHeader';
import EmptyState from '../../../src/components/EmptyState';
import { useCameraStore } from '../../../src/store/cameraStore';
import { useLiveLocation } from '../../../src/hooks/useLiveLocation';
import { useContactsStore } from '../../../src/store/contactsStore';
import { contactActionService } from '../../../src/services/contactActionService';
import { sharingService } from '../../../src/services/sharingService';
import { useMediaStore } from '../../../src/store/mediaStore';
import { mediaService, TripMedia } from '../../../src/services/mediaService';
import ActivityMediaList from '../../../src/components/ActivityMediaList';
import { useTheme } from '../../../src/context/ThemeContext';
import { toast } from '../../../src/store/toastStore';
import { useTripStore } from '../../../src/store/tripStore';
import { apiFetch } from '../../../src/services/api';
import { Modal, ActivityIndicator } from 'react-native';

export default function TripOverviewScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, spacing, radius } = useTheme();

  const stops = MOCK_ITINERARY_STOPS; // Simulating data fetch for trip id
  
  const { activeTrips, applyOptimization } = useTripStore();
  const trip = activeTrips[id as string] || activeTrips['t-101'];
  const totalCost = trip?.estimatedTotalCost || 0;
  const budgetLimit = trip?.budgetLimit || 0;

  const [showOptimization, setShowOptimization] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optData, setOptData] = useState<any>(null);

  const { capturedUri, activeMode, clearCapturedImage } = useCameraStore();
  const { isSharing, startSharing, stopSharing, error: locationError } = useLiveLocation();

  const { tripCompanions, emergencyContacts, addTravelBuddy } = useContactsStore();
  const companions = tripCompanions[id as string] || [];
  const eContacts = emergencyContacts[id as string] || [];

  const { tripMedia, addMedia, updateMediaFields, setCoverPhoto } = useMediaStore();
  const photos = tripMedia[id as string] || [];
  const coverMedia = photos.find(m => m.isCover) || null;
  const coverImage = coverMedia?.uri || null;

  const processAndUploadCover = async (uri: string) => {
    const mediaId = `cover-${Date.now()}`;
    const placeholder: TripMedia = {
      id: mediaId, tripId: id as string, uri, isCover: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), uploadStatus: 'pending', uploadProgress: 0
    };
    addMedia(id as string, placeholder);
    setCoverPhoto(id as string, mediaId); // Ensures any previous cover is unset

    try {
      const compressed = await mediaService.compressImage(uri);
      const finalUri = compressed?.uri || uri;
      
      updateMediaFields(id as string, mediaId, { uploadStatus: 'uploading', uri: finalUri });
      
      const remoteUrl = await mediaService.uploadImage(finalUri, id as string, undefined, (prog: number) => {
        updateMediaFields(id as string, mediaId, { uploadProgress: prog });
      });
      
      updateMediaFields(id as string, mediaId, { uploadStatus: 'uploaded', uri: remoteUrl });
    } catch (e) {
      updateMediaFields(id as string, mediaId, { uploadStatus: 'failed' });
      toast.error('Could not upload the cover photo.');
    }
  };

  const handleAddCover = () => {
    Alert.alert('Cover Photo', 'Choose photo source', [
      { text: 'Camera', onPress: () => router.push('/camera?mode=cover' as any) },
      { text: 'Photo Library', onPress: async () => {
          const result = await mediaService.pickImages(false);
          if (result && result.assets && result.assets.length > 0) {
            processAndUploadCover(result.assets[0].uri);
          }
      }},
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  useEffect(() => {
    if (activeMode === 'cover' && capturedUri) {
      processAndUploadCover(capturedUri);
      clearCapturedImage();
    }
  }, [activeMode, capturedUri]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await new Promise(res => setTimeout(res, 800));
      toast.success('Trip details refreshed');
    } catch (e) {
      toast.error('Failed to refresh trip details');
    } finally {
      setRefreshing(false);
    }
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const response = await apiFetch(`/api/trips/${id}/optimize`, {
        method: 'PATCH',
        body: JSON.stringify({ apply: false })
      });
      setOptData(response);
    } catch (e: any) {
      toast.error(e.message || 'Failed to fetch optimization data');
      setShowOptimization(false);
    } finally {
      setIsOptimizing(false);
    }
  };

  const applyOpt = async () => {
    if (!optData) return;
    try {
      await applyOptimization(id as string, optData.optimizedBreakdown, optData.optimizedTotal, optData.savings);
      setShowOptimization(false);
      toast.success('Trip successfully optimized! 🎉');
    } catch (e: any) {
      toast.error(e.message || 'Failed to apply optimization');
    }
  };

  return (
    <ScreenWrapper style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View className="px-6 pt-4 pb-4 border-b border-gray-100 flex-row justify-between items-center z-10 bg-white shadow-sm">
        <TouchableOpacity onPress={() => router.push('/(tabs)/trips')} className="p-2 -ml-2">
          <MaterialIcons name="arrow-back" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>Trip Overview</Text>
        <TouchableOpacity onPress={() => router.push(`/trips/${id}/builder`)} className="p-2 -mr-2 bg-purple-50 rounded-full">
           <MaterialIcons name="edit" size={20} color="#7C3AED" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}

        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        
        {/* Top Summary / Cover Photo */}
        <ImageBackground 
          source={coverImage ? { uri: coverImage } : undefined}
          style={{ width: '100%', borderRadius: 24, padding: 24, marginBottom: 24, overflow: 'hidden', backgroundColor: coverImage ? undefined : '#7C3AED' }}
        >
          {coverImage && <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)' }]} />}
          
          <View style={{ zIndex: 10 }}>
            <View className="flex-row justify-between items-start mb-6">
              <Text className="text-white/90 font-medium text-base">Estimated Total Cost</Text>
              <TouchableOpacity onPress={handleAddCover} className="bg-white/20 px-3 py-1.5 rounded-full items-center flex-row">
                 <MaterialIcons name="camera-alt" size={14} color="white" />
                 <Text className="text-white ml-2 text-xs font-bold">{coverMedia && coverMedia.uploadStatus === 'uploading' ? 'Uploading...' : (coverImage ? 'Change Cover' : 'Add Cover')}</Text>
              </TouchableOpacity>
            </View>
             {coverMedia && coverMedia.uploadStatus === 'uploading' && (
               <View className="mb-4">
                 <View className="h-1.5 bg-white/30 rounded-full w-full overflow-hidden">
                    <View className="h-full bg-white rounded-full" style={{ width: `${coverMedia.uploadProgress}%` }} />
                 </View>
                 <Text className="text-white text-xs font-medium mt-1 text-right">{Math.round(coverMedia.uploadProgress)}%</Text>
               </View>
            )}
            
            <View className="flex-row items-end justify-between mb-4">
                <Text className="text-4xl font-bold text-white">${totalCost.toLocaleString()}</Text>
                <Text className="text-white/90 text-sm font-bold mb-1">/ ${budgetLimit.toLocaleString()} limit</Text>
            </View>
            
            {trip?.isOptimized ? (
              <View className="bg-white/20 p-3 rounded-2xl flex-row items-center justify-between">
                 <View className="flex-1">
                   <Text className="text-white font-bold text-sm">✨ AI Optimized</Text>
                   <Text className="text-white/90 text-xs mt-0.5">🎉 You saved ${trip.savings.toLocaleString()}</Text>
                 </View>
                 <TouchableOpacity onPress={() => router.push(`/trips/${id}/budget` as any)} className="bg-white px-3 py-1.5 rounded-full ml-2">
                   <Text className="text-primary font-bold text-xs">View Details</Text>
                 </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => { setShowOptimization(true); handleOptimize(); }} className="bg-white/20 py-3 rounded-2xl flex-row items-center justify-center">
                 <Text className="text-xl mr-2">✨</Text>
                 <Text className="text-white font-bold text-sm">Optimize Trip Cost</Text>
              </TouchableOpacity>
            )}
          </View>
        </ImageBackground>

        {/* Quick Navigations */}
        <View className="flex-row justify-between mb-8 space-x-2">
           <TouchableOpacity 
             activeOpacity={0.8}
             onPress={() => router.push(`/trips/${id}/budget` as any)}
             className="flex-1 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 items-center"
           >
              <View className="w-10 h-10 bg-green-50 rounded-full items-center justify-center mb-1.5">
                <MaterialIcons name="pie-chart" size={20} color="#10B981" />
              </View>
              <Text className="font-bold text-gray-900 text-xs">Budget</Text>
           </TouchableOpacity>

           <TouchableOpacity 
             activeOpacity={0.8}
             onPress={() => router.push(`/trips/${id}/map` as any)}
             className="flex-1 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 items-center"
           >
              <View className="w-10 h-10 bg-purple-50 rounded-full items-center justify-center mb-1.5">
                <MaterialIcons name="map" size={20} color="#7C3AED" />
              </View>
              <Text className="font-bold text-gray-900 text-xs">Map</Text>
           </TouchableOpacity>

           <TouchableOpacity 
             activeOpacity={0.8}
             onPress={() => router.push(`/trips/${id}/calendar` as any)}
             className="flex-1 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 items-center"
           >
              <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mb-1.5">
                <MaterialIcons name="event" size={20} color="#3B82F6" />
              </View>
              <Text className="font-bold text-gray-900 text-xs">Timeline</Text>
           </TouchableOpacity>
           
           <TouchableOpacity 
             activeOpacity={0.8}
             onPress={() => router.push(`/trips/${id}/journal` as any)}
             className="flex-1 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 items-center"
           >
              <View className="w-10 h-10 bg-orange-50 rounded-full items-center justify-center mb-1.5">
                <MaterialIcons name="photo-library" size={20} color="#F97316" />
              </View>
              <Text className="font-bold text-gray-900 text-xs">Journal</Text>
           </TouchableOpacity>

           <TouchableOpacity 
             activeOpacity={0.8}
             onPress={() => router.push(`/trips/${id}/gallery` as any)}
             className="flex-1 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 items-center"
           >
              <View className="w-10 h-10 bg-teal-50 rounded-full items-center justify-center mb-1.5">
                <MaterialIcons name="collections" size={20} color="#14B8A6" />
              </View>
              <Text className="font-bold text-gray-900 text-xs">Gallery</Text>
           </TouchableOpacity>
        </View>

        {/* Itinerary Summary list */}
        <SectionHeader title="Itinerary Highlights" />
        
        {stops.length === 0 ? (
          <View className="mb-6">
            <EmptyState 
              title="No Itinerary Found" 
              description="You haven't added any stops yet. Add cities to start planning."
              iconName="map"
            />
          </View>
        ) : (
          stops.map(stop => (
          <View key={stop.id} className="mb-6 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
             <View className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex-row justify-between items-center">
                <Text className="font-bold text-gray-900 text-lg">{stop.city}</Text>
                <Text className="text-gray-500 text-sm">{stop.days} Days</Text>
             </View>
             <View className="p-4">
                {stop.activities.length > 0 ? (
                  stop.activities.map((act, index) => (
                    <View key={act.id} className={`${index !== stop.activities.length - 1 ? 'border-b border-gray-100 pb-3 mb-3' : ''}`}>
                       <View className="flex-row justify-between items-center">
                          <View className="flex-1 pr-4">
                            <Text className="font-bold text-gray-900 mb-1">{act.title}</Text>
                            <Text className="text-sm text-gray-500">{act.duration} • {act.type}</Text>
                          </View>
                          <Text className="font-bold text-primary bg-purple-50 px-2 py-1 rounded-lg">${act.cost}</Text>
                       </View>
                       <ActivityMediaList tripId={id as string} activityId={act.id} />
                    </View>
                  ))
                ) : (
                  <Text className="text-gray-400 italic text-center py-2">No activities added yet.</Text>
                )}
              </View>
           </View>
          ))
        )}

        {/* Recommendations */}
        <SectionHeader title="Contact Recommendations" />
        <View className="mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3">
              <MaterialIcons name="lightbulb" size={20} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-gray-900">Friends who visited</Text>
              <Text className="text-xs text-gray-500 mt-0.5">
                Dhruv Patel visited {stops.length > 0 ? stops[0].city : 'here'} in 2025.
              </Text>
            </View>
            <TouchableOpacity onPress={() => contactActionService.messageContact()} className="px-3 py-1.5 bg-blue-50 rounded-full">
              <Text className="text-blue-600 font-bold text-xs">Ask Tip</Text>
            </TouchableOpacity>
        </View>

        {/* Travel Companions Portal */}
        <SectionHeader title="Travel Companions" />
        {companions.length === 0 ? (
          <View className="mb-4">
            <EmptyState 
              title="Flying Solo?" 
              description="You haven't added any companions to this trip yet. Share the adventure!"
              iconName="people-outline"
            />
          </View>
        ) : (
          companions.map(c => (
          <View key={c.id} className="bg-white px-4 py-3 border border-gray-100 rounded-2xl flex-row items-center justify-between mb-3 shadow-sm">
            <View className="flex-row items-center flex-1 pr-2">
              {c.imageUri ? (
                <Image source={{ uri: c.imageUri }} className="w-10 h-10 rounded-full" />
              ) : (
                <View className="w-10 h-10 rounded-full bg-purple-100 items-center justify-center">
                  <Text className="text-primary font-bold">{c.name.charAt(0)}</Text>
                </View>
              )}
              <View className="ml-3 flex-1">
                <Text className="font-bold text-gray-900 text-base" numberOfLines={1}>{c.name}</Text>
                <Text className={`text-xs font-medium ${c.isTriporaUser ? 'text-primary' : 'text-gray-400'}`}>
                   {c.isTriporaUser ? 'Joined' : 'Invitation Pending'}
                </Text>
              </View>
            </View>
            <View className="flex-row space-x-2">
               <TouchableOpacity onPress={() => contactActionService.callContact(c.phone)} className="w-9 h-9 rounded-full bg-gray-50 items-center justify-center border border-gray-200">
                 <MaterialIcons name="call" size={16} color="#4B5563" />
               </TouchableOpacity>
               <TouchableOpacity onPress={() => contactActionService.messageContact(c.phone)} className="w-9 h-9 rounded-full bg-gray-50 items-center justify-center border border-gray-200 mx-2">
                 <MaterialIcons name="message" size={16} color="#4B5563" />
               </TouchableOpacity>
               <TouchableOpacity onPress={() => { addTravelBuddy(c); toast.success('Added to Travel Buddies!'); }} className="w-9 h-9 rounded-full bg-yellow-50 items-center justify-center border border-yellow-200">
                 <MaterialIcons name="star" size={18} color="#EAB308" />
               </TouchableOpacity>
            </View>
          </View>
          ))
        )}

        <TouchableOpacity 
          onPress={() => router.push(`/contacts-selector?tripId=${id}&mode=companion` as any)} 
          className="bg-gray-50 border border-gray-200 border-dashed py-3 rounded-2xl items-center flex-row justify-center mb-6"
        >
          <MaterialIcons name="person-add" size={18} color="#6B7280" />
          <Text className="ml-2 font-medium text-gray-500">Add Companion</Text>
        </TouchableOpacity>

        {/* Emergency Contacts */}
        <SectionHeader title="Emergency Contacts" />
        {eContacts.map(ec => (
          <View key={ec.id} className="bg-red-50 px-4 py-3 border border-red-100 rounded-2xl flex-row items-center justify-between mb-3 shadow-[0_4px_10px_rgba(239,68,68,0.1)]">
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-10 h-10 rounded-full bg-red-100 items-center justify-center">
                <Text className="text-red-500 font-bold">{ec.name.charAt(0)}</Text>
              </View>
              <View className="ml-3 flex-1">
                <Text className="font-bold text-gray-900 text-base" numberOfLines={1}>{ec.name}</Text>
                {ec.phone && <Text className="text-xs text-gray-500 font-medium">{ec.phone}</Text>}
              </View>
            </View>
            <TouchableOpacity onPress={() => contactActionService.callContact(ec.phone)} className="px-4 py-2 rounded-xl bg-red-500 shadow-sm flex-row items-center">
               <MaterialIcons name="call" size={16} color="white" />
               <Text className="text-white font-bold text-xs ml-1">Call</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity 
          onPress={() => router.push(`/contacts-selector?tripId=${id}&mode=emergency` as any)} 
          className="bg-gray-50 border border-red-200 border-dashed py-3 rounded-2xl items-center flex-row justify-center mb-6"
        >
          <MaterialIcons name="add-ic-call" size={18} color="#EF4444" />
          <Text className="ml-2 font-medium text-red-500">Add Emergency Contact</Text>
        </TouchableOpacity>


        {/* Documents Portal */}
        <SectionHeader title="Trip Resources" />
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={() => router.push(`/trips/${id}/insights` as any)}
          className="bg-white px-4 py-5 rounded-2xl shadow-sm border border-gray-100 flex-row items-center mb-3"
        >
           <View className="w-12 h-12 bg-pink-50 rounded-full items-center justify-center mr-4">
              <MaterialIcons name="insights" size={24} color="#EC4899" />
           </View>
           <View className="flex-1">
              <Text className="font-bold text-gray-900 text-base mb-0.5">Trip Insights</Text>
              <Text className="text-gray-500 text-xs">Analyze stats, pace, and spending distribution.</Text>
           </View>
           <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
        </TouchableOpacity>

        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={() => router.push(`/trips/${id}/documents` as any)}
          className="bg-white px-4 py-5 rounded-2xl shadow-sm border border-gray-100 flex-row items-center mb-6"
        >
           <View className="w-12 h-12 bg-indigo-50 rounded-full items-center justify-center mr-4">
              <MaterialIcons name="folder-open" size={24} color="#6366F1" />
           </View>
           <View className="flex-1">
              <Text className="font-bold text-gray-900 text-base mb-0.5">Documents & Bookings</Text>
              <Text className="text-gray-500 text-xs">Scan and store tickets, reservations, etc.</Text>
           </View>
           <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => sharingService.shareNative("Check out this awesome trip itinerary I'm planning in Tripora!", "https://tripora.app/share/TRP-MOCK-1234")}
          className="bg-primary/5 border border-primary/20 mt-4 py-4 rounded-2xl items-center justify-center flex-row"
        >
          <MaterialIcons name="ios-share" size={20} color="#7C3AED" />
          <Text className="text-primary font-bold text-base ml-2">Share With OS</Text>
        </TouchableOpacity>
        
        <View className="flex-row justify-between mt-3 space-x-2">
            <TouchableOpacity onPress={() => sharingService.shareViaWhatsApp("Check out this awesome trip itinerary I'm planning in Tripora!", "https://tripora.app/share/TRP-MOCK-1234")} className="flex-1 bg-[#25D366]/10 border border-[#25D366]/20 py-3 rounded-xl items-center justify-center flex-row mr-2">
              <MaterialIcons name="chat" size={16} color="#25D366" />
              <Text className="text-[#25D366] font-bold text-sm ml-1.5">WhatsApp</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => sharingService.shareViaSMS("Check out this awesome trip!", "https://tripora.app/share/TRP-MOCK-1234")} className="flex-1 bg-blue-50 border border-blue-200 py-3 rounded-xl items-center justify-center flex-row mr-2">
              <MaterialIcons name="sms" size={16} color="#3B82F6" />
              <Text className="text-blue-500 font-bold text-sm ml-1.5">SMS</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => sharingService.shareViaEmail("Check out this trip!", "https://tripora.app/share/TRP-MOCK-1234")} className="flex-1 bg-gray-100 border border-gray-200 py-3 rounded-xl items-center justify-center flex-row">
              <MaterialIcons name="email" size={16} color="#4B5563" />
              <Text className="text-gray-600 font-bold text-sm ml-1.5">Email</Text>
            </TouchableOpacity>
        </View>

        <TouchableOpacity 
          onPress={isSharing ? stopSharing : startSharing}
          className={`border mt-4 py-4 rounded-2xl items-center justify-center flex-row ${
            isSharing ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
          }`}
        >
          <MaterialIcons name="share-location" size={20} color={isSharing ? "#EF4444" : "#10B981"} />
          <Text className={`font-bold text-lg ml-2 ${isSharing ? 'text-red-500' : 'text-green-600'}`}>
            {isSharing ? 'Stop Live Location' : 'Share Live Location'}
          </Text>
        </TouchableOpacity>

        {locationError && (
          <Text className="text-red-500 text-center text-xs mt-2">{locationError}</Text>
        )}

      </ScrollView>

      {/* Optimization Modal */}
      <Modal visible={showOptimization} transparent={true} animationType="slide">
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-3xl p-6 min-h-[50%] pt-8 shadow-xl">
            <View className="w-12 h-1.5 bg-gray-300 rounded-full absolute top-3 self-center" />
            
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center">
                <Text className="text-2xl mr-2">✨</Text>
                <Text className="text-xl font-black text-gray-900">AI Trip Optimization</Text>
              </View>
              <TouchableOpacity onPress={() => setShowOptimization(false)} className="p-2 bg-gray-100 rounded-full">
                <MaterialIcons name="close" size={20} color="#4B5563" />
              </TouchableOpacity>
            </View>

            {isOptimizing || !optData ? (
              <View className="flex-1 justify-center items-center py-10">
                <ActivityIndicator size="large" color="#7C3AED" className="mb-4" />
                <Text className="text-lg font-bold text-primary mb-1">AI is analyzing your trip...</Text>
                <Text className="text-gray-500 text-sm">Finding better accommodations and transport...</Text>
              </View>
            ) : (
              <View className="flex-1">
                <View className="flex-row justify-between mb-6">
                  <View className="bg-gray-50 p-4 rounded-2xl flex-1 mr-2 border border-gray-100">
                    <Text className="text-gray-500 text-xs font-medium mb-1">Original Costs</Text>
                    <Text className="text-xl font-bold text-gray-400 line-through">${trip.estimatedTotalCost.toLocaleString()}</Text>
                  </View>
                  <View className="bg-green-50 p-4 rounded-2xl flex-1 ml-2 border border-green-200 shadow-sm">
                    <Text className="text-green-700 text-xs font-bold mb-1">Optimized Cost</Text>
                    <Text className="text-2xl font-black text-green-600">${optData.optimizedTotal.toLocaleString()}</Text>
                  </View>
                </View>

                <View className="bg-primary/10 p-4 rounded-2xl mb-6 border border-primary/20 items-center border-dashed">
                  <Text className="text-primary font-bold text-base">🎉 You Save ${optData.savings.toLocaleString()}</Text>
                </View>

                <Text className="font-bold text-gray-900 mb-3 text-lg">Optimization Suggestions:</Text>
                <ScrollView showsVerticalScrollIndicator={false} className="max-h-[180px] mb-6">
                  {optData.suggestions.map((sug: any, idx: number) => (
                    <View key={idx} className="flex-row items-center p-3 bg-gray-50 rounded-xl mb-2 border border-gray-100">
                      <MaterialIcons name="check-circle" size={20} color="#10B981" />
                      <View className="ml-3 flex-1">
                        <Text className="text-sm text-gray-800 font-medium">{sug.text}</Text>
                        <Text className="text-xs text-green-600 font-bold mt-0.5">Save ${sug.savings.toLocaleString()}</Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>

                <View className="flex-row space-x-3">
                  <TouchableOpacity onPress={() => setShowOptimization(false)} className="flex-1 py-4 bg-gray-100 rounded-2xl items-center mr-2">
                    <Text className="text-gray-600 font-bold text-base">Keep Original</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={applyOpt} className="flex-1 py-4 bg-primary rounded-2xl items-center shadow-lg shadow-primary/30">
                    <Text className="text-white font-bold text-base">Apply Savings</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}
