/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    // The embedded Sanity Studio is built with styled-components.
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
