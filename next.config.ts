import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This project sits inside a larger repo that has its own lockfile. Pin the
  // workspace root here so the build always resolves files from this folder.
  turbopack: {
    root: __dirname,
  },
  images: {
    // Placeholder artwork ships as SVG. Real photos (jpg/png/webp) need no
    // extra config. SVG support is opt-in because SVGs can contain scripts —
    // these files are first-party (we author them), so it is safe here.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Allow optimizing images uploaded to the Supabase Storage bucket.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lxdbcsruoekqznkduntj.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
