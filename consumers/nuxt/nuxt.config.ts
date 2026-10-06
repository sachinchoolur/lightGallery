export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: false },
    telemetry: false,
    app: { head: { title: 'lightGallery consumer: Nuxt', htmlAttrs: { lang: 'en' } } },
    css: [
        'lightgallery/css/lightgallery.css',
        'lightgallery/css/lg-zoom.css',
        'lightgallery/css/lg-thumbnail.css',
    ],
});
