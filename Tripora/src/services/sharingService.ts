import { Linking, Platform, Share, Alert } from 'react-native';

export class SharingService {
  async shareNative(message: string, url: string) {
    try {
      await Share.share({
        message: `${message}\n${url}`,
        title: 'Tripora Trip',
      });
    } catch (error) {
      Alert.alert('Sharing Error', 'Failed to share natively.');
    }
  }

  async shareViaWhatsApp(message: string, url: string, phone?: string) {
    const text = encodeURIComponent(`${message}\n${url}`);
    let target = `whatsapp://send?text=${text}`;
    if (phone) {
      target = `whatsapp://send?phone=${phone}&text=${text}`;
    }
    
    try {
      const supported = await Linking.canOpenURL(target);
      if (supported) {
        await Linking.openURL(target);
      } else {
        Alert.alert('WhatsApp Unavailable', 'Make sure WhatsApp is installed on your device.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open WhatsApp.');
    }
  }

  async shareViaSMS(message: string, url: string, phone?: string) {
    const body = encodeURIComponent(`${message}\n${url}`);
    
    let target = '';
    if (Platform.OS === 'ios') {
      target = phone ? `sms:${phone}&body=${body}` : `sms:&body=${body}`;
    } else {
      target = phone ? `sms:${phone}?body=${body}` : `sms:?body=${body}`;
    }
    
    try {
      const supported = await Linking.canOpenURL(target);
      if (supported) {
        await Linking.openURL(target);
      } else {
        Alert.alert('SMS Unavailable', 'Your device does not support SMS.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open messages.');
    }
  }

  async shareViaEmail(message: string, url: string, email?: string) {
    const subject = encodeURIComponent('Invited to Tripora Trip');
    const body = encodeURIComponent(`${message}\n\n${url}`);
    const target = `mailto:${email || ''}?subject=${subject}&body=${body}`;
    
    try {
      const supported = await Linking.canOpenURL(target);
      if (supported) {
        await Linking.openURL(target);
      } else {
        Alert.alert('Email Unavailable', 'Your device cannot send emails right now.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open email client.');
    }
  }
}

export const sharingService = new SharingService();
