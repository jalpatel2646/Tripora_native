import { create } from 'zustand';

interface CameraState {
  capturedUri: string | null;
  activeMode: string | null;
  setCapturedImage: (uri: string, mode: string) => void;
  clearCapturedImage: () => void;
}

export const useCameraStore = create<CameraState>((set) => ({
  capturedUri: null,
  activeMode: null,
  setCapturedImage: (uri, mode) => set({ capturedUri: uri, activeMode: mode }),
  clearCapturedImage: () => set({ capturedUri: null, activeMode: null })
}));
