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
            color: '#252525',
            borderRadius: '16px',
            padding: '14px 20px',
            fontSize: '13px',
            fontWeight: '800',
            maxWidth: '500px',
            width: '100%',
            wordBreak: 'break-word',
          },
          success: {
            style: {
              background: '#FFFFFF',
              color: '#065F46',
              border: '1.5px solid #10B981',
              boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.15), 0 8px 10px -6px rgba(16, 185, 129, 0.1)',
            },
            iconTheme: {
              primary: '#10B981', // Pure Green
              secondary: '#FFFFFF',
            },
          },
          error: {
            style: {
              background: '#FFFFFF',
              color: '#991B1B',
              border: '1.5px solid #EF4444',
              boxShadow: '0 20px 25px -5px rgba(239, 68, 68, 0.15), 0 8px 10px -6px rgba(239, 68, 68, 0.1)',
            },
            iconTheme: {
              primary: '#EF4444', // Pure Red
              secondary: '#FFFFFF',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
};
