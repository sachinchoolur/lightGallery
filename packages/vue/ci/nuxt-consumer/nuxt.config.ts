export default defineNuxtConfig({
    ssr: true,
    nitro: {
        prerender: {
            routes: ['/'],
        },
    },
});
