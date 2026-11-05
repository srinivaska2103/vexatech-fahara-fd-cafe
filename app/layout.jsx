import './globals.css';
import { QueryProvider } from '../providers/QueryProvider';
import { ConfirmProvider } from '@/components/ui/ConfirmModal';

export const metadata = {
  title: 'Grab2GO Cafe',
  description: 'Grab2GO Cafe Management Platform',
  icons: {
    icon: '/grab-it-logo.png',
    shortcut: '/grab-it-logo.png',
    apple: '/grab-it-logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/grab-it-logo.png" type="image/png" />
        <link rel="shortcut icon" href="/grab-it-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/grab-it-logo.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#E50914" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Grab2GO Partner" />
      </head>
      <body>
        <QueryProvider>
          <ConfirmProvider>
            {children}
          </ConfirmProvider>
        </QueryProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.log('SW registration skipped: ', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

