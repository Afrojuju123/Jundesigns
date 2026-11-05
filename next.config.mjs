/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "frame-src 'self' https://cybqa.pesapal.com https://pay.pesapal.com;",
              "frame-ancestors 'self';",
            ].join(" "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
