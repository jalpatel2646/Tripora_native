import { create } from 'zustand';
import { apiFetch } from '../services/api';

export interface CostBreakdown {
  transport: number;
  accommodation: number;
  food: number;
  activities: number;
  miscellaneous: number;
}

export interface TripState {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  destinationsCount: number;
  imageUrl: string;
  budgetLimit: number;
  estimatedTotalCost: number;
  originalEstimatedCost: number;
  optimizedCost: number | null;
  savings: number;
  isOptimized: boolean;
  costBreakdown: CostBreakdown;
}

interface TripStore {
  activeTrips: Record<string, TripState>;
  isLoading: boolean;
  error: string | null;
  fetchTrips: () => Promise<void>;
  fetchTrip: (tripId: string) => void;
  updateTripCost: (tripId: string, breakdown: Partial<CostBreakdown>) => Promise<void>;
  applyOptimization: (tripId: string, optimizedBreakdown: CostBreakdown, optimizedTotal: number, savings: number) => Promise<void>;
  deleteTrip: (tripId: string) => Promise<void>;
  createTrip: (tripData: any) => Promise<string>;
}
export const useTripStore = create<TripStore>((set, get) => ({
  activeTrips: {},
  isLoading: false,
  error: null,

  deleteTrip: async (tripId) => {
    try {
      await apiFetch(`/api/trips/${tripId}`, { method: 'DELETE' });
      set((state) => {
        const next = { ...state.activeTrips };
        delete next[tripId];
        return { activeTrips: next };
      });
    } catch (err: any) {
      throw err;
    }
  },

  createTrip: async (tripData: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiFetch(`/api/trips`, {
        method: 'POST',
        body: JSON.stringify(tripData)
      });
      const trip = response.data;
      
      const parsedTrip: TripState = {
        id: trip._id,
        name: trip.title || trip.name || 'Untitled Trip',
        destination: trip.destination || '',
        startDate: new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        endDate: new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        destinationsCount: trip.stops?.length || 1,
        imageUrl: trip.coverPhoto || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
        budgetLimit: trip.budgetLimit || 0,
        estimatedTotalCost: trip.estimatedTotalCost || 0,
        originalEstimatedCost: trip.originalEstimatedCost || 0,
        optimizedCost: trip.optimizedCost || null,
        savings: trip.savings || 0,
        isOptimized: trip.isOptimized || false,
        costBreakdown: trip.costBreakdown || { transport: 0, accommodation: 0, food: 0, activities: 0, miscellaneous: 0 },
      };

      set((state) => ({ 
        activeTrips: { ...state.activeTrips, [trip._id]: parsedTrip }, 
        isLoading: false 
      }));
      return trip._id;
    } catch (error: any) {
      set({ error: error.message || 'Failed to create trip', isLoading: false });
      throw error;
    }
  },

  fetchTrips: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiFetch('/api/trips');
      
      const tripsRecord: Record<string, TripState> = {};
      response.data.forEach((trip: any) => {
        tripsRecord[trip._id] = {
          id: trip._id,
          name: trip.title || trip.name || 'Untitled Trip',
          destination: trip.destination || '',
          startDate: new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          endDate: new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          destinationsCount: trip.stops?.length || 1,
          imageUrl: trip.coverPhoto || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
          budgetLimit: trip.budgetLimit || 0,
          estimatedTotalCost: trip.estimatedTotalCost || 0,
          originalEstimatedCost: trip.originalEstimatedCost || 0,
          optimizedCost: trip.optimizedCost || null,
          savings: trip.savings || 0,
          isOptimized: trip.isOptimized || false,
          costBreakdown: trip.costBreakdown || { transport: 0, accommodation: 0, food: 0, activities: 0, miscellaneous: 0 },
        };
      });

      set({ activeTrips: tripsRecord, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch trips', isLoading: false });
      console.error('Failed to fetch trips:', error);
    }
  },
  
  fetchTrip: async (tripId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiFetch(`/api/trips/${tripId}`);
      const trip = response.data;
      
      const parsedTrip: TripState = {
        id: trip._id,
        name: trip.title || trip.name || 'Untitled Trip',
        destination: trip.destination || '',
        startDate: new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        endDate: new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        destinationsCount: trip.stops?.length || 1,
        imageUrl: trip.coverPhoto || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
        budgetLimit: trip.budgetLimit || 0,
        estimatedTotalCost: trip.estimatedTotalCost || 0,
        originalEstimatedCost: trip.originalEstimatedCost || 0,
        optimizedCost: trip.optimizedCost || null,
        savings: trip.savings || 0,
        isOptimized: trip.isOptimized || false,
        costBreakdown: trip.costBreakdown || { transport: 0, accommodation: 0, food: 0, activities: 0, miscellaneous: 0 },
      };

      set((state) => ({ 
        activeTrips: { ...state.activeTrips, [tripId]: parsedTrip }, 
        isLoading: false 
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch trip details', isLoading: false });
      console.error('Failed to fetch trip:', error);
    }
  },

  updateTripCost: async (tripId, newBreakdown) => {
    // Validate negative values immediately
    for (const val of Object.values(newBreakdown)) {
      if (val !== undefined && val < 0) {
        throw new Error('Cost values cannot be negative.');
      }
    }

    const { activeTrips } = get();
    const trip = activeTrips[tripId];
    if (!trip) throw new Error('Trip not found contextually');

    const updatedBreakdown = { ...trip.costBreakdown, ...newBreakdown };
    const newTotal = Object.values(updatedBreakdown).reduce((acc, val) => acc + val, 0);

    const patchPayload = {
      costBreakdown: updatedBreakdown,
      estimatedTotalCost: newTotal,
      originalEstimatedCost: trip.isOptimized ? trip.originalEstimatedCost : newTotal,
      optimizedCost: trip.isOptimized ? trip.optimizedCost : null
    };

    set({ isLoading: true, error: null });

    try {
      await apiFetch(`/api/trips/${tripId}`, {
        method: 'PATCH',
        body: JSON.stringify(patchPayload)
      });

      set((state) => {
        const currentTrip = state.activeTrips[tripId];
        if (!currentTrip) return state;

        return {
          activeTrips: {
            ...state.activeTrips,
            [tripId]: {
              ...currentTrip,
              ...patchPayload
            }
          },
          isLoading: false
        };
      });
    } catch (error: any) {
      set({ error: error.message || 'Failed to sync budget', isLoading: false });
      throw error;
    }
  },

  applyOptimization: async (tripId, optimizedBreakdown, optimizedTotal, savings) => {
    try {
      set({ isLoading: true, error: null });
      // Call backend to actually record and apply the optimization
      await apiFetch(`/api/trips/${tripId}/optimize`, {
        method: 'PATCH',
        body: JSON.stringify({ apply: true })
      });

      set((state) => {
        const trip = state.activeTrips[tripId];
        if (!trip) return state;

        const updatedTrip = {
          ...trip,
          costBreakdown: optimizedBreakdown,
          estimatedTotalCost: optimizedTotal,
          optimizedCost: optimizedTotal,
          savings: savings,
          isOptimized: true,
        };

        return {
          activeTrips: {
            ...state.activeTrips,
            [tripId]: updatedTrip
          },
          isLoading: false
        };
      });
    } catch (error: any) {
      set({ error: error.message || 'Failed to apply optimization', isLoading: false });
      throw error; // Let UI catch it
    }
  }
}));
