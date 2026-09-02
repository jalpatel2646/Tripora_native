import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Modal, TextInput, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenWrapper from '../../../src/components/ScreenWrapper';
import PrimaryButton from '../../../src/components/PrimaryButton';
import EmptyState from '../../../src/components/EmptyState';
import { useCameraStore } from '../../../src/store/cameraStore';

interface DocumentModel {
  id: string;
  name: string;
  uri: string;
  type: string;
}

export default function TripDocumentsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const [documents, setDocuments] = useState<DocumentModel[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [docName, setDocName] = useState('');
  
  const { capturedUri, activeMode, clearCapturedImage } = useCameraStore();
  const [pendingUri, setPendingUri] = useState<string | null>(null);

  useEffect(() => {
    if (activeMode === 'document' && capturedUri) {
      setPendingUri(capturedUri);
      setModalVisible(true);
      clearCapturedImage();
    }
  }, [activeMode, capturedUri]);

  const handleSaveDocument = () => {
    if (!docName.trim() || !pendingUri) return;
    const newDoc: DocumentModel = {
      id: Math.random().toString(),
      name: docName,
      uri: pendingUri,
      type: 'Scanned Document'
    };
    setDocuments(prev => [newDoc, ...prev]);
    setDocName('');
    setPendingUri(null);
    setModalVisible(false);
  };

  const handleDelete = (docId: string) => {
    Alert.alert('Delete Document', 'Are you sure you want to remove this document?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setDocuments(prev => prev.filter(d => d.id !== docId)) }
    ]);
  };

  return (
    <ScreenWrapper className="bg-gray-50 flex-1">
      {/* Header */}
      <View className="px-6 pt-4 pb-4 border-b border-gray-100 flex-row justify-between items-center z-10 bg-white shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <MaterialIcons name="arrow-back" size={24} color="#4B5563" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Trip Documents</Text>
        <TouchableOpacity onPress={() => router.push('/camera?mode=document')} className="p-2 -mr-2 bg-purple-50 rounded-full flex-row items-center border border-purple-100">
           <MaterialIcons name="document-scanner" size={16} color="#7C3AED" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        
        <TouchableOpacity 
          onPress={() => router.push('/camera?mode=document')}
          className="bg-primary/10 border border-primary/20 py-4 rounded-2xl items-center justify-center flex-row mb-8"
        >
          <MaterialIcons name="document-scanner" size={24} color="#7C3AED" />
          <Text className="text-primary font-bold text-lg ml-2">Scan New Document</Text>
        </TouchableOpacity>

        {documents.length === 0 ? (
          <View className="mt-4">
            <EmptyState 
              title="No Documents" 
              description="Store your flight tickets, hotel bookings, and receipts here for easy access."
              iconName="folder-open"
            />
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between">
             {documents.map(doc => (
                <View key={doc.id} className="w-[48%] bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
                   <View className="bg-gray-100 h-32 w-full justify-center items-center relative">
                      <Image source={{ uri: doc.uri }} className="w-full h-full" resizeMode="cover" />
                      <View className="absolute top-2 right-2 bg-black/40 rounded-full p-1.5 shadow-sm">
                         <TouchableOpacity onPress={() => handleDelete(doc.id)}>
                            <MaterialIcons name="delete" size={14} color="white" />
                         </TouchableOpacity>
                      </View>
                   </View>
                   <View className="p-3">
                      <Text className="font-bold text-gray-900 text-sm mb-0.5" numberOfLines={1}>{doc.name}</Text>
                      <Text className="text-xs text-gray-500">{doc.type}</Text>
                   </View>
                </View>
             ))}
          </View>
        )}

      </ScrollView>

      {/* Naming Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
         <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' }}>
            <View style={{ backgroundColor: 'white', padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                 <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Save Document</Text>
                 <TouchableOpacity onPress={() => { setModalVisible(false); setPendingUri(null); }}><MaterialIcons name="close" size={24} color="#374151" /></TouchableOpacity>
              </View>
              
              <View style={{ height: 120, width: '100%', marginBottom: 16, borderRadius: 12, overflow: 'hidden', backgroundColor: '#F3F4F6' }}>
                 {pendingUri && <Image source={{ uri: pendingUri }} className="w-full h-full" resizeMode="cover" />}
              </View>

              <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 6, fontWeight: 'bold' }}>Document Name</Text>
              <TextInput 
                style={styles.input} 
                value={docName} 
                onChangeText={setDocName} 
                placeholder="e.g. Flight Boarding Pass"
              />
              
              <PrimaryButton title="Save to Trip" onPress={handleSaveDocument} className="mt-4" />
            </View>
         </KeyboardAvoidingView>
      </Modal>

    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#111827',
    marginBottom: 8
  }
});
