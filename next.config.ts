import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Powered-By', value: 'Hidden' }, // ya remove kar do
          { key: 'Server', value: 'Secure' },
        ],
      }];
  } ,
   images: {
    domains: ["source.unsplash.com","images.unsplash.com","www.untitledui.com",'mubashir-blog-assets.s3.ap-south-1.amazonaws.com'],
  },

};

export default nextConfig;
