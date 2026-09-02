import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType, duration?: number) => string;
  hideToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  showToast: (message, type = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substring(7);
    set((state) => ({
      toasts: [...state.toasts, { id, type, message, duration }],
    }));
    
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
    
    return id;
  },
  hideToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

// Convenience helper to avoid hooks where not possible
export const toast = {
  success: (msg: string, duration?: number) => useToastStore.getState().showToast(msg, 'success', duration),
  error: (msg: string, duration?: number) => useToastStore.getState().showToast(msg, 'error', duration),
  info: (msg: string, duration?: number) => useToastStore.getState().showToast(msg, 'info', duration),
  warning: (msg: string, duration?: number) => useToastStore.getState().showToast(msg, 'warning', duration),
  dismiss: (id: string) => useToastStore.getState().hideToast(id),
};
