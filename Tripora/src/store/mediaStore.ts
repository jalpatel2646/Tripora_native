import { create } from 'zustand';
import { TripMedia } from '../services/mediaService';

type MediaState = {
  // Stored categorically by Trip ID
  tripMedia: Record<string, TripMedia[]>;
  
  // Actions
  addMedia: (tripId: string, media: TripMedia | TripMedia[]) => void;
  updateMediaFields: (tripId: string, mediaId: string, updates: Partial<TripMedia>) => void;
  removeMedia: (tripId: string, mediaId: string) => void;
  setCoverPhoto: (tripId: string, mediaId: string) => void;
};

export const useMediaStore = create<MediaState>((set, get) => ({
  tripMedia: {},

  addMedia: (tripId, mediaInput) => set((state) => {
    const arr = Array.isArray(mediaInput) ? mediaInput : [mediaInput];
    const current = state.tripMedia[tripId] || [];
    return {
      tripMedia: {
        ...state.tripMedia,
        [tripId]: [...arr, ...current],
      }
    };
  }),

  updateMediaFields: (tripId, mediaId, updates) => set((state) => {
    const current = state.tripMedia[tripId] || [];
    const updated = current.map(m => m.id === mediaId ? { ...m, ...updates } : m);
    return {
      tripMedia: {
        ...state.tripMedia,
        [tripId]: updated,
      }
    };
  }),

  removeMedia: (tripId, mediaId) => set((state) => {
    const current = state.tripMedia[tripId] || [];
    return {
      tripMedia: {
        ...state.tripMedia,
        [tripId]: current.filter(m => m.id !== mediaId),
      }
    };
  }),

  setCoverPhoto: (tripId, mediaId) => set((state) => {
    const current = state.tripMedia[tripId] || [];
    const updated = current.map(m => ({
      ...m,
      isCover: m.id === mediaId // Unsets cover on all others, sets on intended photo
    }));
    return {
      tripMedia: {
        ...state.tripMedia,
        [tripId]: updated,
      }
    };
  }),
}));
