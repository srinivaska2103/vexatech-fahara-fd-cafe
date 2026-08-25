import './globals.css';
import { QueryProvider } from '../providers/QueryProvider';
import { ConfirmProvider } from '@/components/ui/ConfirmModal';

export const metadata = {
  title: 'Fahara Cafe',
  description: 'Fahara Cafe Management Platform',
  icons: {
    icon: '/logo.jpeg',
    shortcut: '/logo.jpeg',
    apple: '/logo.jpeg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.jpeg" type="image/jpeg" />
        <link rel="shortcut icon" href="/logo.jpeg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/logo.jpeg" />
      </head>
      <body>
        <QueryProvider>
          <ConfirmProvider>
            {children}
          </ConfirmProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

