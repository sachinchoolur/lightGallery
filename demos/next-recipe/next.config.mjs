/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'picsum.photos' },
            { protocol: 'https', hostname: 'fastly.picsum.photos' },
        ],
    },
};

export default nextConfig;
