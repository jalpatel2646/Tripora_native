import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import DraggableFlatList, { ScaleDecorator, RenderItemParams } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ScreenWrapper from '../../../src/components/ScreenWrapper';
import TimelineItem from '../../../src/components/TimelineItem';
import PrimaryButton from '../../../src/components/PrimaryButton';
import { useCameraStore } from '../../../src/store/cameraStore';

const initialData = [
  { type: 'header', id: 'h1', day: 'Day 1 - Sept 10, 2026' },
  { type: 'event', id: 'e1', time: '10:00 AM', title: 'Arrival at Paris CDG', description: 'Flight AF102, terminal 2E. Take taxi to hotel.', cost: 0 },
  { type: 'event', id: 'e2', time: '02:00 PM', title: 'Eiffel Tower Tour', description: 'Skip-the-line access to the second floor.', cost: 35 },
  { type: 'event', id: 'e3', time: '07:30 PM', title: 'Dinner at Le Jules Verne', description: 'Reservation confirmed for 2 under Alex.', cost: 120 },
  { type: 'header', id: 'h2', day: 'Day 2 - Sept 11, 2026' },
  { type: 'event', id: 'e4', time: '09:00 AM', title: 'Louvre Museum', description: 'Meet guide at the glass pyramid entrance.', cost: 45 },
  { type: 'event', id: 'e5', time: '01:00 PM', title: 'Lunch at Cafe de Flore', description: 'Try the iconic onion soup.', cost: 30 },
  { type: 'event', id: 'e6', time: '03:30 PM', title: 'Seine River Cruise', description: '1-hour panoramic sightseeing cruise.', cost: 25 }
];

export default function TripCalendarScreen() {
  const router = useRouter();
  const [data, setData] = useState<any[]>(initialData);

  const [editItem, setEditItem] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { capturedUri, activeMode, clearCapturedImage } = useCameraStore();

  React.useEffect(() => {
    if (activeMode === 'activity' && capturedUri && editItem) {
      setEditItem((prev: any) => ({ ...prev, photos: [...(prev?.photos || []), capturedUri] }));
      clearCapturedImage();
    }
  }, [activeMode, capturedUri]);

  const handleEditSave = () => {
    if (!editItem) return;
    setData(prev => prev.map(item => item.id === editItem.id ? editItem : item));
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Activity', 'Are you sure you want to remove this activity?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        setData(prev => prev.filter(i => i.id !== id));
        setModalVisible(false);
      }}
    ]);
  };

  const openEditor = (item: any) => {
    setEditItem(item);
    setModalVisible(true);
  };

  const renderItem = ({ item, drag, isActive, getIndex }: RenderItemParams<any>) => {
    const isFirstOfType = getIndex() === 0;

    if (item.type === 'header') {
      return (
        <View style={{ paddingTop: isFirstOfType ? 24 : 32, paddingHorizontal: 24, paddingBottom: 16 }}>
          <View style={{ backgroundColor: '#F3E8FF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, alignSelf: 'flex-start', borderWidth: 1, borderColor: '#E9D5FF' }}>
            <Text style={{ color: '#7C3AED', fontWeight: 'bold' }}>{item.day}</Text>
          </View>
        </View>
      );
    }

    // Checking if next element is header or end of list to hide connecting line
    const nextItem = data[(getIndex() || 0) + 1];
    const isLast = !nextItem || nextItem.type === 'header';

    return (
      <ScaleDecorator>
        <View style={{ paddingHorizontal: 24 }}>
          <TimelineItem
             time={item.time}
             title={item.title}
             description={item.description}
             cost={item.cost}
             isLast={isLast}
             onEdit={() => openEditor(item)}
             onDelete={() => handleDelete(item.id)}
             onLongPress={drag}
             isActive={isActive}
          />
        </View>
      </ScaleDecorator>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScreenWrapper className="bg-gray-50 flex-1">
        
        {/* Header */}
        <View className="px-6 pt-4 pb-4 border-b border-gray-100 flex-row justify-between items-center z-10 bg-white shadow-sm">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <MaterialIcons name="arrow-back" size={24} color="#4B5563" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">Itinerary Timeline</Text>
          <View style={{ width: 24 }} />
        </View>

        <DraggableFlatList
          data={data}
          onDragEnd={({ data }) => setData(data)}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<Text style={{ paddingHorizontal: 24, paddingVertical: 12, color: '#6B7280', fontSize: 13 }}>Long press an activity card to drag and reorder it.</Text>}
        />

      </ScreenWrapper>

      {/* Edit Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
         <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ backgroundColor: 'white', padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: '#000', shadowOffset: {height: -4, width: 0}, shadowOpacity: 0.1, shadowRadius: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                 <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827' }}>Edit Activity</Text>
                 <TouchableOpacity onPress={() => setModalVisible(false)}><MaterialIcons name="close" size={24} color="#374151" /></TouchableOpacity>
              </View>
              
              {editItem && (
                 <ScrollView showsVerticalScrollIndicator={false}>
                   <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 6, fontWeight: 'bold' }}>Title</Text>
                   <TextInput style={styles.input} value={editItem.title} onChangeText={(t) => setEditItem({...editItem, title: t})} />
                   
                   <View style={{ flexDirection: 'row', gap: 12 }}>
                     <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 6, fontWeight: 'bold' }}>Time</Text>
                        <TextInput style={styles.input} value={editItem.time} onChangeText={(t) => setEditItem({...editItem, time: t})} />
                     </View>
                     <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 6, fontWeight: 'bold' }}>Est. Cost ($)</Text>
                        <TextInput style={styles.input} value={editItem.cost.toString()} keyboardType="numeric" onChangeText={(t) => setEditItem({...editItem, cost: parseFloat(t) || 0})} />
                     </View>
                   </View>
                   
                   <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 6, fontWeight: 'bold' }}>Description</Text>
                   <TextInput style={[styles.input, { height: 80 }]} multiline textAlignVertical="top" value={editItem.description} onChangeText={(t) => setEditItem({...editItem, description: t})} />
                   
                   <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 6, fontWeight: 'bold' }}>Activity Photos</Text>
                   <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                     <TouchableOpacity onPress={() => router.push('/camera?mode=activity')} style={{ width: 80, height: 80, backgroundColor: '#F3F4F6', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12, borderWidth: 1, borderColor: '#E5E7EB' }}>
                        <MaterialIcons name="add-a-photo" size={24} color="#7C3AED" />
                     </TouchableOpacity>
                     
                     {editItem.photos?.map((uri: string, idx: number) => (
                       <Image key={idx} source={{ uri }} style={{ width: 80, height: 80, borderRadius: 12, marginRight: 12 }} />
                     ))}
                   </ScrollView>
                   
                   <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
                     <TouchableOpacity 
                       onPress={() => handleDelete(editItem.id)}
                       style={{ flex: 1, backgroundColor: '#FEF2F2', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center' }}
                     >
                        <Text style={{ color: '#EF4444', fontWeight: 'bold' }}>Delete</Text>
                     </TouchableOpacity>
                     
                     <View style={{ flex: 2 }}>
                       <PrimaryButton title="Save Changes" onPress={handleEditSave} className="border border-primary" />
                     </View>
                   </View>
                   <View style={{ height: 40 }}/> 
                 </ScrollView>
              )}
            </View>
         </KeyboardAvoidingView>
      </Modal>

    </GestureHandlerRootView>
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
    marginBottom: 16
  }
});
