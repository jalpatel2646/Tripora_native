import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenWrapper from '../../../src/components/ScreenWrapper';
import { useCameraStore } from '../../../src/store/cameraStore';

interface Memory {
  id: string;
  uri: string;
  caption: string;
  date: string;
}

export default function TripJournalScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const [memories, setMemories] = useState<Memory[]>([]);
  
  const { capturedUri, activeMode, clearCapturedImage } = useCameraStore();

  useEffect(() => {
    if (activeMode === 'memory' && capturedUri) {
      const newMemory: Memory = {
        id: Math.random().toString(),
        uri: capturedUri,
        caption: '',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      };
      setMemories(prev => [newMemory, ...prev]);
      clearCapturedImage();
    }
  }, [activeMode, capturedUri]);

  const updateCaption = (id: string, text: string) => {
    setMemories(prev => prev.map(m => m.id === id ? { ...m, caption: text } : m));
  };

  const deleteMemory = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  return (
    <ScreenWrapper className="bg-gray-50 flex-1">
      {/* Header */}
      <View className="px-6 pt-4 pb-4 border-b border-gray-100 flex-row justify-between items-center z-10 bg-white shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <MaterialIcons name="arrow-back" size={24} color="#4B5563" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Trip Journal</Text>
        <TouchableOpacity onPress={() => router.push('/camera?mode=memory')} className="p-2 -mr-2 bg-purple-50 rounded-full flex-row items-center border border-purple-100">
           <MaterialIcons name="add-a-photo" size={16} color="#7C3AED" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        
        <TouchableOpacity 
          onPress={() => router.push('/camera?mode=memory')}
          className="bg-primary py-4 rounded-2xl items-center justify-center flex-row shadow-md shadow-primary/30 mb-8"
        >
          <MaterialIcons name="camera" size={24} color="white" />
          <Text className="text-white font-bold text-lg ml-2">Capture Memory</Text>
        </TouchableOpacity>

        {memories.length === 0 ? (
          <View className="items-center justify-center py-10">
            <View className="w-24 h-24 bg-purple-50 rounded-full items-center justify-center mb-4">
              <MaterialIcons name="photo-library" size={40} color="#7C3AED" />
            </View>
            <Text className="text-lg font-bold text-gray-900 mb-2">No Memories Yet</Text>
            <Text className="text-gray-500 text-center px-6">Capture your favorite moments and build a visual journal of your trip here.</Text>
          </View>
        ) : (
          memories.map(memory => (
             <View key={memory.id} className="bg-white rounded-3xl p-4 mb-6 shadow-sm border border-gray-100">
               <View className="flex-row justify-between items-center mb-3 px-1">
                  <Text className="text-xs font-bold text-gray-400">{memory.date}</Text>
                  <TouchableOpacity onPress={() => deleteMemory(memory.id)}>
                     <MaterialIcons name="delete-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
               </View>
               <Image source={{ uri: memory.uri }} style={{ width: '100%', height: 250, borderRadius: 16, marginBottom: 12, backgroundColor: '#F3F4F6' }} resizeMode="cover" />
               <TextInput 
                 value={memory.caption}
                 onChangeText={(t) => updateCaption(memory.id, t)}
                 placeholder="Write a caption..."
                 placeholderTextColor="#9CA3AF"
                 className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 text-gray-900"
                 multiline
               />
             </View>
          ))
        )}

      </ScrollView>
    </ScreenWrapper>
  );
}
