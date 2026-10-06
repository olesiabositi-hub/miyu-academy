const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: { serverActions: { bodySizeLimit: "1mb" } },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/en",
        permanent: false
      }
    ];
  }
};
export default nextConfig;
