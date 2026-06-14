import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow phones/other devices on the LAN to load dev resources (HMR, JS chunks).
  // Dev-only setting; has no effect on the deployed (Vercel) site.
  allowedDevOrigins: ["192.168.0.121", "192.168.0.*"],
};

export default nextConfig;
