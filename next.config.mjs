/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/owner/login',
        permanent: true,
      },
      {
        source: '/owner',
        destination: '/owner/dashboard',
        permanent: true,
      },
      {
        source: '/customer/bookings/:id',
        destination: '/owner/bookings/:id',
        permanent: false,
      },
      {
        source: '/customer/bookings',
        destination: '/owner/bookings',
        permanent: false,
      },
      {
        source: '/customer/dashboard',
        destination: '/owner/dashboard',
        permanent: false,
      },
      {
        source: '/customer/profile',
        destination: '/owner/settings',
        permanent: false,
      },
      {
        source: '/customer/invoice/:id',
        destination: '/owner/bookings/:id',
        permanent: false,
      },
      {
        source: '/customer/receipt/:id',
        destination: '/owner/bookings/:id',
        permanent: false,
      },
      {
        source: '/customer',
        destination: '/owner/dashboard',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;


