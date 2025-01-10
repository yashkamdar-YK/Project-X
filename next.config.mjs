
const nextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/my-strategies',
        permanent: true,
      },
      {
        source: '/',
        destination: '/login',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
