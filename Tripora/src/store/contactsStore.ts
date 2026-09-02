import { create } from 'zustand';
import { apiFetch } from '../services/api';

export type AppContact = {
  _id?: string;
  id: string; // Keep for fallback compatibility
  name: string;
  phone?: string;
  email?: string;
  relationship?: string;
  type: 'TRAVEL_COMPANION' | 'EMERGENCY';
  isTriporaUser?: boolean; // Optional mapping indication
  imageUri?: string;
  source?: string;
};

type ContactsState = {
  contacts: AppContact[];
  isLoading: boolean;
  error: string | null;

  // Global Contact Management (CRUD on Backend)
  fetchContacts: () => Promise<void>;
  createContact: (contact: Partial<AppContact>) => Promise<AppContact>;
  updateContact: (id: string, contact: Partial<AppContact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  addTravelBuddy: (contact: Partial<AppContact>) => Promise<void>;

  // Retain trip-binding overrides internally if currently used, or rely on active trip population
  tripCompanions: Record<string, AppContact[]>;
  emergencyContacts: Record<string, AppContact[]>;
  addCompanions: (tripId: string, companions: AppContact[]) => void;
  removeCompanion: (tripId: string, companionId: string) => void;
  addEmergencyContact: (tripId: string, contact: AppContact) => void;
  removeEmergencyContact: (tripId: string, contactId: string) => void;
};

export const useContactsStore = create<ContactsState>((set, get) => ({
  contacts: [],
  isLoading: false,
  error: null,
  tripCompanions: {},
  emergencyContacts: {},

  fetchContacts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiFetch('/api/contacts');
      set({ 
        contacts: response.data.map((c: any) => ({ ...c, id: c._id })),
        isLoading: false 
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createContact: async (contact) => {
    try {
      const response = await apiFetch('/api/contacts', {
        method: 'POST',
        body: JSON.stringify(contact),
      });
      const newContact = { ...response.data, id: response.data._id };
      set((state) => ({ contacts: [...state.contacts, newContact] }));
      return newContact;
    } catch (err: any) {
      throw err;
    }
  },

  updateContact: async (id, updates) => {
    try {
      const response = await apiFetch(`/api/contacts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      const updated = { ...response.data, id: response.data._id };
      set((state) => ({
        contacts: state.contacts.map((c) => (c.id === id ? updated : c)),
      }));
    } catch (err: any) {
      throw err;
    }
  },

  deleteContact: async (id) => {
    try {
      await apiFetch(`/api/contacts/${id}`, { method: 'DELETE' });
      set((state) => ({
        contacts: state.contacts.filter((c) => c.id !== id),
      }));
    } catch (err: any) {
      throw err;
    }
  },

  addTravelBuddy: async (contact) => {
    try {
      await get().createContact({ ...contact, type: 'TRAVEL_COMPANION' });
    } catch (error) {
      console.warn("Failed to add travel buddy", error);
    }
  },

  addCompanions: (tripId, companions) => set((state) => {
    const existing = state.tripCompanions[tripId] || [];
    // Prevent duplicates based on contact ID
    const newCompanions = companions.filter(c => !existing.some(e => e.id === c.id));
    return {
      tripCompanions: {
        ...state.tripCompanions,
        [tripId]: [...existing, ...newCompanions],
      }
    };
  }),

  removeCompanion: (tripId, companionId) => set((state) => {
    const existing = state.tripCompanions[tripId] || [];
    return {
      tripCompanions: {
        ...state.tripCompanions,
        [tripId]: existing.filter(c => c.id !== companionId),
      }
    };
  }),

  addEmergencyContact: (tripId, contact) => set((state) => {
    const existing = state.emergencyContacts[tripId] || [];
    return {
      emergencyContacts: {
        ...state.emergencyContacts,
        [tripId]: [...existing, contact],
      }
    };
  }),

  removeEmergencyContact: (tripId, contactId) => set((state) => {
    const existing = state.emergencyContacts[tripId] || [];
    return {
      emergencyContacts: {
        ...state.emergencyContacts,
        [tripId]: existing.filter(c => c.id !== contactId),
      }
    };
  }),
}));
