import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the Next.js development indicator (the "N" overlay with the
  // Route/Static/Turbopack menu). Compile and runtime errors still surface.
  devIndicators: false,
};

export default nextConfig;
