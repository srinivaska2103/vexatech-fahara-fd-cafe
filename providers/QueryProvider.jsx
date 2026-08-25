'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';

export const QueryProvider = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster 
        position="top-center"
        reverseOrder={false}
        gutter={10}
        containerStyle={{
          top: 24,
          left: 20,
          right: 20,
        }}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#FFFFFF',
            color: '#2C1810',
            border: '1.5px solid #DDB892',
            borderRadius: '16px',
            padding: '14px 20px',
            boxShadow: '0 20px 25px -5px rgba(44, 24, 16, 0.15), 0 8px 10px -6px rgba(44, 24, 16, 0.1)',
            fontSize: '13px',
            fontWeight: '800',
            maxWidth: '500px',
            width: '100%',
            wordBreak: 'break-word',
          },
          success: {
            iconTheme: {
              primary: '#6F4E37',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#E11D48',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
};
