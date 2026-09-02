import * as Contacts from 'expo-contacts';

export type AppContact = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  imageUri?: string;
  source: "device" | "tripora";
  isTriporaUser?: boolean;
};

import { apiFetch } from './api';

export class ContactService {
  async requestPermission(): Promise<boolean> {
    const { status } = await Contacts.requestPermissionsAsync();
    return status === 'granted';
  }

  async getContacts(): Promise<AppContact[]> {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) return [];

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers, Contacts.Fields.Image],
      sort: Contacts.SortTypes.FirstName,
    });

    const normalized = data.map(this.normalizeContact);

    // Call backend to match contacts against real DB users
    try {
      const response = await apiFetch('/api/contacts/match', {
        method: 'POST',
        body: JSON.stringify({ contacts: normalized })
      });
      return response.data; // this returns the contacts array with isTriporaUser updated
    } catch (e) {
      console.warn("Failed to match contacts on backend", e);
      return normalized; // Fallback to unresolved contacts
    }
  }

  async searchContacts(query: string): Promise<AppContact[]> {
    const contacts = await this.getContacts();
    return contacts.filter(contact => {
      const q = query.toLowerCase();
      // Only return relevant filtering efficiently
      return contact.name.toLowerCase().includes(q) || 
             (contact.phone && contact.phone.includes(q)) || 
             (contact.email && contact.email.toLowerCase().includes(q));
    });
  }

  private normalizeContact(contact: Contacts.Contact): AppContact {
    let phone: string | undefined = undefined;
    if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
      phone = contact.phoneNumbers[0].number;
    }

    let email: string | undefined = undefined;
    if (contact.emails && contact.emails.length > 0) {
      email = contact.emails[0].email;
    }

    return {
      id: (contact as any).id || (contact as any).lookupKey || Math.random().toString(),
      name: contact.name || 'Unknown Contact',
      phone,
      email,
      imageUri: contact.image?.uri,
      source: 'device',
      isTriporaUser: false, // Initially false, updated by backend
    };
  }
}

export const contactService = new ContactService();
