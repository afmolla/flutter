import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const configDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  poweredByHeader: false,
  skipProxyUrlNormalize: true,
  /** DevTools "N" göstergesini kapat */
  devIndicators: false,
  webpack: (config) => {
    config.resolve ??= {};
    config.resolve.alias = {
      ...(config.resolve.alias as Record<string, string> | undefined),
      "@": configDir,
    };
    return config;
  },
  turbopack: { root: configDir },
  images: {
    formats: ["image/webp", "image/avif"],
    remotePatterns: [],
  },
  compress: true,
};

export default nextConfig;
