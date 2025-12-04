import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["pub-69d4cb07f7ab48eeb80c69a6942f922e.r2.cloudflarestorage.com"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
