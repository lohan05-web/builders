/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow next/image to optimise the Unsplash hero/background photos.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
