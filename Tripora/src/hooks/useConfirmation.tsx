import React, { createContext, useContext, useState, ReactNode } from 'react';
import ConfirmationModal from '../components/ui/ConfirmationModal';

export interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => Promise<void> | void;
}

interface ConfirmationContextType {
  confirm: (options: ConfirmationOptions) => void;
}

const ConfirmationContext = createContext<ConfirmationContextType | null>(null);

export const ConfirmationProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmationOptions | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const confirm = (opts: ConfirmationOptions) => {
    setOptions(opts);
    setIsOpen(true);
  };

  const handleConfirm = async () => {
    if (!options) return;
    setIsConfirming(true);
    
    try {
      await options.onConfirm();
      setIsOpen(false);
      setOptions(null);
    } catch (error) {
      // Allow modal to stay open if error, or close, depending on preference.
      // Usually the user would see a toast from their onConfirm handler.
    } finally {
      setIsConfirming(false);
    }
  };

  const handleCancel = () => {
    if (isConfirming) return;
    setIsOpen(false);
    // Add small delay to avoid flicker before destroying options
    setTimeout(() => setOptions(null), 300);
  };

  return (
    <ConfirmationContext.Provider value={{ confirm }}>
      {children}
      <ConfirmationModal
        visible={isOpen}
        title={options?.title || ''}
        message={options?.message || ''}
        confirmText={options?.confirmText}
        cancelText={options?.cancelText}
        isDestructive={options?.isDestructive}
        isLoading={isConfirming}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmationContext.Provider>
  );
};

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirmation must be used within a ConfirmationProvider');
  }
  return context;
};
