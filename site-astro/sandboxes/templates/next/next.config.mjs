/** @type {import('next').NextConfig} */
export default {
    images: {
        // StackBlitz runs Node inside the browser, where Next's image
        // optimizer (a native library) cannot load: the sample photos are
        // served as they are. On a real deployment leave this out.
        unoptimized: true,
        remotePatterns: [{ protocol: 'https', hostname: 'picsum.photos' }],
    },
};
