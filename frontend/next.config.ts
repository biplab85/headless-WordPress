import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        pathname:
          "/sklentr/headless-WordPress/wordpress/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "admin.sklentr.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
