const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: { serverActions: { bodySizeLimit: "1mb" } },

  // Lesson Markdown and the visual manifest are read from disk at request time.
  // Include them explicitly in server output tracing so Netlify's Next.js
  // serverless bundle contains the course source files.
  outputFileTracingIncludes: {
    "/*": ["./content/greek-mythology/**/*"]
  },

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
