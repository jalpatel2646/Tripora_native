import * as Contacts from 'expo-contacts';

export type AppContact = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  imageUri?: string;
  source: "device" | "tripora";
  isTriporaUser?: boolean; // Mock backend matching
};

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

    return data.map(this.normalizeContact);
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
      id: contact.id || Math.random().toString(),
      name: contact.name || 'Unknown Contact',
      phone,
      email,
      imageUri: contact.image?.uri,
      source: 'device',
      isTriporaUser: Math.random() > 0.8, // 20% chance they are a Tripora user for matching requirements
    };
  }
}

export const contactService = new ContactService();
