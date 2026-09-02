import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useContactsStore, AppContact } from '../src/store/contactsStore';
import ScreenWrapper from '../src/components/ScreenWrapper';
import { toast } from '../src/store/toastStore';

export default function ContactsManagerScreen() {
  const router = useRouter();
  const { contacts, fetchContacts, createContact, updateContact, deleteContact, isLoading } = useContactsStore();
  
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [relationship, setRelationship] = useState('');
  const [isEmergencyContact, setIsEmergencyContact] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const resetForm = () => {
    setName('');
    setPhone('');
    setEmail('');
    setRelationship('');
    setIsEmergencyContact(false);
    setIsAdding(false);
    setIsEditing(null);
  };

  const handleEdit = (contact: AppContact) => {
    setName(contact.name);
    setPhone(contact.phone || '');
    setEmail(contact.email || '');
    setRelationship(contact.relationship || '');
    setIsEmergencyContact(contact.type === 'EMERGENCY');
    setIsEditing(contact.id);
    setIsAdding(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    const payload: Partial<AppContact> = {
      name,
      phone,
      email,
      relationship,
      type: isEmergencyContact ? 'EMERGENCY' : 'TRAVEL_COMPANION'
    };

    try {
      if (isEditing) {
        await updateContact(isEditing, payload);
        toast.success("Contact updated!");
      } else {
        await createContact(payload);
        toast.success("Contact created!");
      }
      resetForm();
    } catch (e: any) {
      toast.error(e.message || "Failed to save contact");
    }
  };

  const handleDelete = (id: string, contactName: string) => {
    Alert.alert("Delete Contact", `Are you sure you want to remove ${contactName}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
          try {
            await deleteContact(id);
            toast.success("Contact deleted");
          } catch (e: any) {
            toast.error(e.message || "Failed to delete contact");
          }
      }}
    ]);
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    (c.phone && c.phone.includes(search)) || 
    (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <ScreenWrapper className="bg-gray-50 flex-1">
      <View className="px-5 py-4 border-b border-gray-100 flex-row items-center justify-between bg-white z-10 shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <MaterialIcons name="arrow-back" size={24} color="#4B5563" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">My Contacts</Text>
        <TouchableOpacity onPress={() => { resetForm(); setIsAdding(true); }} className="p-2 bg-purple-50 rounded-full">
          <MaterialIcons name="person-add" size={22} color="#7C3AED" />
        </TouchableOpacity>
      </View>

      {isAdding ? (
        <ScrollView className="bg-white p-5 flex-1">
          <Text className="text-xl font-bold mb-4 text-gray-900">{isEditing ? 'Edit Contact' : 'New Contact'}</Text>

          <Text className="font-bold text-gray-500 text-xs uppercase mb-1">Full Name</Text>
          <TextInput value={name} onChangeText={setName} className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100" placeholder="e.g. Rahul Patel" />
          
          <Text className="font-bold text-gray-500 text-xs uppercase mb-1">Phone Number</Text>
          <TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100" placeholder="e.g. +91 9876543210" />
          
          <Text className="font-bold text-gray-500 text-xs uppercase mb-1">Email Address</Text>
          <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100" placeholder="e.g. rahul@example.com" />
          
          <Text className="font-bold text-gray-500 text-xs uppercase mb-1">Relationship (Optional)</Text>
          <TextInput value={relationship} onChangeText={setRelationship} className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100" placeholder="e.g. Brother" />

          <View className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl mb-6 border border-gray-100">
             <View>
                <Text className="font-bold text-gray-900">Emergency Contact</Text>
                <Text className="text-gray-500 text-xs mt-1">Designate this person for emergencies</Text>
             </View>
             <TouchableOpacity onPress={() => setIsEmergencyContact(!isEmergencyContact)}>
                 <View className={`w-12 h-6 rounded-full px-1 justify-center ${isEmergencyContact ? 'bg-primary' : 'bg-gray-300'}`}>
                    <View className={`w-4 h-4 rounded-full bg-white shadow-sm ${isEmergencyContact ? 'self-end' : 'self-start'}`} />
                 </View>
             </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleSave} className="bg-primary py-4 rounded-xl items-center shadow-lg shadow-primary/30 mb-4">
             <Text className="text-white font-bold text-lg">Save Contact</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={resetForm} className="py-4 rounded-xl items-center bg-gray-100 mb-10">
             <Text className="text-gray-600 font-bold text-lg">Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <>
          <View className="px-5 py-3 bg-white">
            <View className="flex-row items-center bg-gray-100 px-4 py-2 rounded-xl">
              <MaterialIcons name="search" size={20} color="#9CA3AF" />
              <TextInput value={search} onChangeText={setSearch} placeholder="Search saved contacts..." className="flex-1 ml-2 text-base text-gray-900" />
            </View>
          </View>

          {isLoading ? (
             <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#7C3AED" />
             </View>
          ) : (
            <ScrollView contentContainerStyle={{ padding: 20 }}>
              {filteredContacts.length === 0 ? (
                <View className="items-center mt-10">
                  <MaterialIcons name="contacts" size={64} color="#D1D5DB" />
                  <Text className="font-bold text-gray-900 mt-4 text-lg">No Contacts Found</Text>
                  <Text className="text-gray-500 text-center mt-2 px-10">You have no saved Tripora contacts. Add your travel companions and emergency contacts here.</Text>
                </View>
              ) : (
                filteredContacts.map(c => (
                  <View key={c.id} className="bg-white p-4 rounded-2xl mb-3 flex-row items-center justify-between shadow-sm border border-gray-100">
                     <View className="flex-row items-center flex-1">
                        <View className={`w-12 h-12 rounded-full items-center justify-center ${c.type === 'EMERGENCY' ? 'bg-red-50' : 'bg-purple-50'}`}>
                           <MaterialIcons name={c.type === 'EMERGENCY' ? 'health-and-safety' : 'person'} size={24} color={c.type === 'EMERGENCY' ? '#EF4444' : '#7C3AED'} />
                        </View>
                        <View className="ml-3 flex-1">
                           <Text className="font-bold text-gray-900 text-base">{c.name}</Text>
                           {c.relationship && <Text className="text-gray-400 text-xs font-bold uppercase mt-0.5">{c.relationship}</Text>}
                           {c.phone && <Text className="text-gray-500 text-sm mt-0.5">{c.phone}</Text>}
                        </View>
                     </View>
                     <View className="flex-row ml-2">
                        <TouchableOpacity onPress={() => handleEdit(c)} className="p-2 bg-gray-50 rounded-full mr-2 border border-gray-200">
                           <MaterialIcons name="edit" size={16} color="#4B5563" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDelete(c.id, c.name)} className="p-2 bg-red-50 rounded-full border border-red-100">
                           <MaterialIcons name="delete" size={16} color="#EF4444" />
                        </TouchableOpacity>
                     </View>
                  </View>
                ))
              )}
            </ScrollView>
          )}
        </>
      )}
    </ScreenWrapper>
  );
}
