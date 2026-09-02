import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useContactsStore, AppContact } from '../src/store/contactsStore';
import ScreenWrapper from '../src/components/ScreenWrapper';

export default function ContactsSelectorScreen() {
  const router = useRouter();
  const { tripId, mode } = useLocalSearchParams<{ tripId: string, mode: 'companion' | 'emergency' }>();
  
  const [search, setSearch] = useState('');
  
  const [selectedIds, setSelectedIds] = useState<Record<string, AppContact>>({});
  
  const { contacts, fetchContacts, isLoading, addCompanions } = useContactsStore();

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSelect = (contact: AppContact) => {
    if (mode === 'emergency') {
      // Pick one at a time for emergency logic usually, but here we can just set one and return
      setSelectedIds({ [contact.id]: contact });
    } else {
      setSelectedIds(prev => {
        const next = { ...prev };
        if (next[contact.id]) delete next[contact.id];
        else next[contact.id] = contact;
        return next;
      });
    }
  };

  const handleConfirm = () => {
    const selected = Object.values(selectedIds);
    if (mode === 'companion') {
      addCompanions(tripId as string, selected);
    } else if (mode === 'emergency') {
      // Just an example redirect for emergency to a form, or direct save
      // Will route back and let the form pick it up, or just save immediately
      // Actually let's assume we pass it or save directly:
      // Note: Full emergency contact format requires relationship/notes which might mean a form.
    }
    router.back();
  };

  const selectedCount = Object.keys(selectedIds).length;

  const filteredContacts = contacts.filter(c => {
    const q = search.toLowerCase();
    const typeMatch = mode === 'emergency' ? c.type === 'EMERGENCY' : c.type === 'TRAVEL_COMPANION';
    const textMatch = c.name.toLowerCase().includes(q) || (c.phone && c.phone.includes(q)) || (c.email && c.email.toLowerCase().includes(q));
    return typeMatch && textMatch;
  });

  return (
    <ScreenWrapper className="bg-white flex-1">
      <View className="px-5 py-4 border-b border-gray-100 flex-row items-center justify-between">
        <Text className="text-xl font-bold text-gray-900">
          {mode === 'emergency' ? 'Select Emergency Contact' : 'Add Travel Companions'}
        </Text>
        <TouchableOpacity onPress={() => router.back()} className="p-2 bg-gray-100 rounded-full">
          <MaterialIcons name="close" size={20} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <View className="px-5 py-4 border-b border-gray-100 bg-white shadow-sm z-10">
        <View className="flex-row items-center bg-gray-100 px-4 py-2.5 rounded-xl">
          <MaterialIcons name="search" size={22} color="#9CA3AF" />
          <TextInput
            placeholder="Search contacts..."
            className="flex-1 ml-2 text-base text-gray-900"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <MaterialIcons name="cancel" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text className="text-gray-500 mt-4">Loading contacts...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20 }}>

          <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">All Contacts</Text>
          {filteredContacts.map(c => (
            <ContactRow key={c.id} contact={c} isSelected={!!selectedIds[c.id]} onToggle={() => handleSelect(c)} />
          ))}
          {filteredContacts.length === 0 && (
            <Text className="text-center text-gray-400 mt-10">No contacts found.</Text>
          )}
        </ScrollView>
      )}

      {selectedCount > 0 && (
        <View className="absolute bottom-0 left-0 right-0 bg-white p-5 border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] pt-4 pb-8">
          <TouchableOpacity 
            onPress={handleConfirm}
            className="w-full bg-primary py-4 rounded-2xl items-center justify-center shadow-lg shadow-primary/30"
          >
            <Text className="text-white font-bold text-lg">
              {mode === 'companion' ? `Add ${selectedCount} Companion${selectedCount > 1 ? 's' : ''}` : 'Confirm Contact'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScreenWrapper>
  );
}

function ContactRow({ contact, isSelected, onToggle }: { contact: AppContact; isSelected: boolean; onToggle: () => void; }) {
  return (
    <TouchableOpacity onPress={onToggle} className="flex-row items-center justify-between py-3 border-b border-gray-100">
      <View className="flex-row items-center flex-1">
        {contact.imageUri ? (
          <Image source={{ uri: contact.imageUri }} className="w-12 h-12 rounded-full" />
        ) : (
          <View className={`w-12 h-12 rounded-full items-center justify-center ${contact.type === 'EMERGENCY' ? 'bg-red-50' : 'bg-purple-50'}`}>
            <Text className={`font-bold ${contact.type === 'EMERGENCY' ? 'text-red-500' : 'text-primary'}`}>{contact.name.charAt(0)}</Text>
          </View>
        )}
        <View className="ml-3 flex-1">
          <Text className="text-base font-bold text-gray-900">{contact.name}</Text>
          {contact.phone && <Text className="text-xs text-gray-500 mt-0.5">{contact.phone}</Text>}
        </View>
      </View>
      <View className={`w-6 h-6 rounded-full border items-center justify-center ${isSelected ? 'bg-primary border-primary' : 'border-gray-300 bg-white'}`}>
        {isSelected && <MaterialIcons name="check" size={16} color="white" />}
      </View>
    </TouchableOpacity>
  );
}
