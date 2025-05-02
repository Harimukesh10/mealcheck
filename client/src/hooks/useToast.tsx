import { ToastOptions } from 'react-toastify';
import { ToastContext } from '../context/ToastContext';
import { useContext } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastContextType {
  showToast: (type: ToastType, message: string, options?: ToastOptions) => void;
}

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};