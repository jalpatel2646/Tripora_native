import { Linking, Platform, Alert } from 'react-native';

export class ContactActionService {
  async callContact(phone?: string) {
    if (!phone) {
      Alert.alert('No Phone Number', 'This contact does not have a valid phone number.');
      return;
    }
    
    const target = `tel:${phone}`;
    try {
      const supported = await Linking.canOpenURL(target);
      if (supported) {
        await Linking.openURL(target);
      } else {
        Alert.alert('Call Unavailable', 'Your device does not support calling.');
      }
    } catch (err) {
      Alert.alert('Error', 'Could not initiate the call.');
    }
  }

  async messageContact(phone?: string) {
    if (!phone) {
      Alert.alert('No Phone Number', 'This contact does not have a valid phone number.');
      return;
    }
    
    let target = '';
    if (Platform.OS === 'ios') {
      target = `sms:${phone}`;
    } else {
      target = `sms:${phone}`;
    }

    try {
      const supported = await Linking.canOpenURL(target);
      if (supported) {
        await Linking.openURL(target);
      } else {
        Alert.alert('Message Unavailable', 'Your device does not support messaging.');
      }
    } catch (err) {
      Alert.alert('Error', 'Could not open messages.');
    }
  }
}

export const contactActionService = new ContactActionService();
