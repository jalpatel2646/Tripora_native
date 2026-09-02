import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useMediaStore } from '../store/mediaStore';
import { mediaService, TripMedia } from '../services/mediaService';

const MAX_ACTIVITY_PHOTOS = 5;

export default function ActivityMediaList({ tripId, activityId } : { tripId: string; activityId: string }) {
  const { tripMedia, addMedia, removeMedia, updateMediaFields, setCoverPhoto } = useMediaStore();
  
  // Filter media belonging specifically to this activity
  const allPhotos = tripMedia[tripId] || [];
  const activityPhotos = allPhotos.filter(m => m.activityId === activityId);
  const photoCount = activityPhotos.length;

  const handleAddPhotos = async () => {
    if (photoCount >= MAX_ACTIVITY_PHOTOS) {
      Alert.alert('Maximum Photos Reached', `You can only add up to ${MAX_ACTIVITY_PHOTOS} photos for an activity. Please remove an existing photo first.`);
      return;
    }

    const availableSlots = MAX_ACTIVITY_PHOTOS - photoCount;
    const result = await mediaService.pickImages(true, availableSlots);
    if (!result || !result.assets) return;

    for (const asset of result.assets) {
      const mediaId = `act-${activityId}-${Date.now()}-${Math.random()}`;
      
      const placeholder: TripMedia = {
        id: mediaId, tripId, activityId, uri: asset.uri, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), uploadStatus: 'pending', uploadProgress: 0
      };
      
      addMedia(tripId, placeholder);
      
      // Async upload logic to not block UI immediately
      (async () => {
        try {
          const compressed = await mediaService.compressImage(asset.uri);
          updateMediaFields(tripId, mediaId, { uploadStatus: 'uploading', uri: compressed?.uri || asset.uri });
          const remoteUrl = await mediaService.uploadImage(compressed?.uri || asset.uri, tripId, activityId, (prog: number) => {
            updateMediaFields(tripId, mediaId, { uploadProgress: prog });
          });
          updateMediaFields(tripId, mediaId, { uploadStatus: 'uploaded', uri: remoteUrl });
        } catch {
          updateMediaFields(tripId, mediaId, { uploadStatus: 'failed' });
        }
      })();
    }
  };

  const showOptions = (mediaId: string) => {
    Alert.alert('Photo Options', 'What would you like to do?', [
      { text: 'Set as Trip Cover', onPress: () => {
         setCoverPhoto(tripId, mediaId);
         Alert.alert('Success', 'Trip cover updated!');
      }},
      { text: 'Delete Photo', style: 'destructive', onPress: () => removeMedia(tripId, mediaId) },
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  return (
    <View className="mt-2">
       <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 10 }}>
          {activityPhotos.map(photo => (
             <TouchableOpacity key={photo.id} onPress={() => showOptions(photo.id)} style={{ width: 80, height: 80 }}>
                <Image source={{ uri: photo.uri }} style={{ width: '100%', height: '100%', borderRadius: 12, backgroundColor: '#E5E7EB' }} />
                
                {photo.uploadStatus === 'uploading' && (
                  <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', borderRadius: 12 }]}>
                     <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 10 }}>{Math.round(photo.uploadProgress)}%</Text>
                  </View>
                )}
                
                {photo.uploadStatus === 'failed' && (
                  <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(239,68,68,0.5)', justifyContent: 'center', alignItems: 'center', borderRadius: 12 }]}>
                     <MaterialIcons name="error" size={20} color="white" />
                  </View>
                )}
             </TouchableOpacity>
          ))}

          {photoCount < MAX_ACTIVITY_PHOTOS && (
             <TouchableOpacity 
               onPress={handleAddPhotos}
               style={{ width: 80, height: 80, borderRadius: 12, backgroundColor: '#F3E8FF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#DDD6FE', borderStyle: 'dashed' }}
             >
                <MaterialIcons name="add-a-photo" size={24} color="#7C3AED" />
                <Text style={{ fontSize: 10, color: '#7C3AED', fontWeight: 'bold', marginTop: 4 }}>{photoCount}/{MAX_ACTIVITY_PHOTOS}</Text>
             </TouchableOpacity>
          )}
       </ScrollView>
    </View>
  );
}
