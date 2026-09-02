import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Modal, Alert, StyleSheet, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useMediaStore } from '../../../src/store/mediaStore';
import { mediaService, TripMedia } from '../../../src/services/mediaService';
import ScreenWrapper from '../../../src/components/ScreenWrapper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function TripGalleryScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { tripMedia, addMedia, removeMedia, updateMediaFields, setCoverPhoto } = useMediaStore();
  const photos = tripMedia[id as string] || [];
  
  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const openViewer = (index: number) => {
    setSelectedPhotoIndex(index);
    setViewerVisible(true);
  };

  const handleAddPhotos = async () => {
    const result = await mediaService.pickImages(true, 10);
    if (!result || !result.assets) return;

    for (const asset of result.assets) {
      const mediaId = `gallery-${Date.now()}-${Math.random()}`;
      const placeholder: TripMedia = {
        id: mediaId, tripId: id as string, uri: asset.uri, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), uploadStatus: 'pending', uploadProgress: 0
      };
      addMedia(id as string, placeholder);
      
      // Async upload logic to not block UI immediately
      (async () => {
        try {
          const compressed = await mediaService.compressImage(asset.uri);
          updateMediaFields(id as string, mediaId, { uploadStatus: 'uploading', uri: compressed?.uri || asset.uri });
          const remoteUrl = await mediaService.uploadImage(compressed?.uri || asset.uri, id as string, undefined, (prog: number) => {
            updateMediaFields(id as string, mediaId, { uploadProgress: prog });
          });
          updateMediaFields(id as string, mediaId, { uploadStatus: 'uploaded', uri: remoteUrl });
        } catch {
          updateMediaFields(id as string, mediaId, { uploadStatus: 'failed' });
        }
      })();
    }
  };

  const handleDelete = (mediaId: string) => {
    Alert.alert('Delete Photo?', 'This photo will be removed from your trip.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
          removeMedia(id as string, mediaId);
          setViewerVisible(false);
      }}
    ]);
  };

  const renderPhoto = ({ item, index }: { item: TripMedia, index: number }) => (
    <TouchableOpacity onPress={() => openViewer(index)} style={{ flex: 1/3, aspectRatio: 1, padding: 2 }}>
       <Image source={{ uri: item.uri }} style={{ flex: 1, borderRadius: 8, backgroundColor: '#E5E7EB' }} />
       {item.uploadStatus === 'uploading' && (
         <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', borderRadius: 8, margin: 2 }]}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>{Math.round(item.uploadProgress)}%</Text>
         </View>
       )}
       {item.uploadStatus === 'failed' && (
         <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(239,68,68,0.5)', justifyContent: 'center', alignItems: 'center', borderRadius: 8, margin: 2 }]}>
            <MaterialIcons name="error" size={24} color="white" />
         </View>
       )}
    </TouchableOpacity>
  );

  const selectedPhoto = photos[selectedPhotoIndex];

  return (
    <ScreenWrapper className="bg-white flex-1">
      <View className="px-5 py-4 border-b border-gray-100 flex-row items-center justify-between z-10 bg-white">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <MaterialIcons name="arrow-back" size={24} color="#4B5563" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Trip Gallery</Text>
        <TouchableOpacity onPress={handleAddPhotos} className="p-2 -mr-2 bg-purple-50 rounded-full">
           <MaterialIcons name="add-photo-alternate" size={20} color="#7C3AED" />
        </TouchableOpacity>
      </View>

      {photos.length === 0 ? (
        <View className="flex-1 items-center justify-center p-6">
          <MaterialIcons name="photo-library" size={64} color="#D1D5DB" />
          <Text className="text-gray-900 font-bold text-lg mt-4 text-center">No photos yet</Text>
          <Text className="text-gray-500 text-center mt-2 mb-6">Capture your first travel memory or upload from your gallery.</Text>
          <TouchableOpacity onPress={handleAddPhotos} className="bg-primary px-6 py-3 rounded-xl flex-row items-center shadow-lg shadow-primary/30">
            <Text className="text-white font-bold ml-2">Add Photos</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList 
          data={photos}
          keyExtractor={item => item.id}
          numColumns={3}
          renderItem={renderPhoto}
          contentContainerStyle={{ padding: 4 }}
        />
      )}

      {/* Full-Screen Viewer Modal */}
      <Modal visible={viewerVisible} transparent={true} animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'black' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 60, zIndex: 10 }}>
             <TouchableOpacity onPress={() => setViewerVisible(false)} style={{ padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 }}>
               <MaterialIcons name="close" size={24} color="white" />
             </TouchableOpacity>
             <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => { setCoverPhoto(id as string, selectedPhoto.id); Alert.alert('Success', 'Cover photo updated!'); }} style={{ padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, marginRight: 10 }}>
                 <MaterialIcons name="wallpaper" size={24} color="white" />
               </TouchableOpacity>
               <TouchableOpacity onPress={() => handleDelete(selectedPhoto.id)} style={{ padding: 8, backgroundColor: 'rgba(239,68,68,0.8)', borderRadius: 20 }}>
                 <MaterialIcons name="delete" size={24} color="white" />
               </TouchableOpacity>
             </View>
          </View>
          
          {selectedPhoto && (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Image source={{ uri: selectedPhoto.uri }} style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH * 1.5 }} resizeMode="contain" />
              
              <View style={{ position: 'absolute', bottom: 50, left: 20, right: 20, backgroundColor: 'rgba(0,0,0,0.6)', padding: 16, borderRadius: 16 }}>
                 <Text style={{ color: 'white' }}>{selectedPhoto.caption || "No caption added. Edit to add one!"}</Text>
                 <TouchableOpacity style={{ marginTop: 10, alignSelf: 'flex-start' }} onPress={() => {
                   // In a real app we'd open a text input. Mocking for now:
                   updateMediaFields(id as string, selectedPhoto.id, { caption: 'A beautiful memory!' });
                   Alert.alert('Caption Updated', 'Added successfully.');
                 }}>
                    <Text style={{ color: '#A78BFA', fontWeight: 'bold' }}>Edit Caption</Text>
                 </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </ScreenWrapper>
  );
}
