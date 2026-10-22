/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    // The embedded Sanity Studio is built with styled-components.
    styledComponents: true,
  },
  images: {
    // Allow next/image to optimise the Unsplash hero/background photos and
    // the images stored in Sanity.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
