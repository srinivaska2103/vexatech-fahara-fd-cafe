export default function manifest() {
  return {
    name: 'Grab2GO Partner Portal',
    short_name: 'Grab2GO Partner',
    description: 'Grab2GO Partner Management & Food Orders Platform',
    start_url: '/owner/dashboard',
    display: 'standalone',
    background_color: '#FFF5F5',
    theme_color: '#E50914',
    icons: [
      {
        src: '/grab-it-logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/grab-it-logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
