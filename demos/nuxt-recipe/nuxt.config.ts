export default defineNuxtConfig({
    modules: ['@nuxt/image'],
    image: {
        domains: ['picsum.photos', 'fastly.picsum.photos'],
    },
    devtools: { enabled: false },
    telemetry: false,
});
