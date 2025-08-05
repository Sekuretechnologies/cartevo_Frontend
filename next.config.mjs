/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const nextConfig = {
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': path.resolve(__dirname, './'),
        };

        return config;
    },
    images: {
            remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
    reactStrictMode: false,
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    async redirects() {
        return [
          {
            source: "/",
            destination: "/login",
            permanent: false,
          },
          {
            source: "/dashboard",
            destination: "/dashboard/v1/home",
            permanent: false,
          },
          {
            source: "/dashboard/v1",
            destination: "/dashboard/v1/home",
            permanent: false,
          },
          {
            source: "/dashboard/v2",
            destination: "/dashboard/v1/home",
            permanent: false,
          },
        ];
    },
};

export default nextConfig;
