import { useState } from 'react';

export const useToast = (duration: number = 5000) => {
  const [message, setMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), duration);
  };

  const clearToast = () => setMessage(null);

  return {
    toastMessage: message,
    showToast,
    clearToast,
  };
};
