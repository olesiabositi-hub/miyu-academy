const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: { serverActions: { bodySizeLimit: "1mb" } },

  // Lesson Markdown and the visual manifest are read from disk at request time.
  // Include them explicitly in server output tracing so Netlify's Next.js
  // serverless bundle contains the course source files.
  outputFileTracingIncludes: {
    "/*": ["./content/**/*"]
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" }
        ]
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/",
        destination: "/en",
        permanent: false
      },
      // Accounts were removed: progress now lives in the browser. Old links go to the home page.
      { source: "/:locale(en|ru)/account", destination: "/:locale", permanent: true },
      { source: "/:locale(en|ru)/sign-in", destination: "/:locale", permanent: true },
      { source: "/auth/:path*", destination: "/en", permanent: true }
    ];
  }
};
export default nextConfig;
