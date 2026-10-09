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

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://accounts.google.com; object-src 'none'" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" }
        ]
      },
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }]
      }
    ];
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
