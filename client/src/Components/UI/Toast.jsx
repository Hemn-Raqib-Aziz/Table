import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

function ToasterSingleton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Toaster
      position="top-right"
      gutter={8}
      toastOptions={{
        style: {
          background: '#fff',
          color: '#4a4a4a',
          padding: '12px 16px',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '400',
          boxShadow: 'none',
          border: 'none',
          userSelect: 'none',
          minWidth: '240px',
        },
        success: {
          style: {
            color: '#2a9d8f',
          },
          iconTheme: {
            primary: '#2a9d8f',
            secondary: '#ffffff',
          },
        },
        error: {
          style: {
            color: '#e76f51',
          },
          iconTheme: {
            primary: '#e76f51',
            secondary: '#ffffff',
          },
        },
      }}
      containerStyle={{
        top: 24,
        right: 24,
      }}
    />
  );
}

// Mount Toaster once
const singletonRoot = document.createElement('div');
document.body.appendChild(singletonRoot);

import { createRoot } from 'react-dom/client';
createRoot(singletonRoot).render(<ToasterSingleton />);

export default toast;
