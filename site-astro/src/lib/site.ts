/**
 * Site-wide parameters, ported from the Hugo config
 * (`site/config/_default/{config,params,menus}.toml`). One module instead
 * of three TOML files; values are unchanged.
 */

export const SITE = {
    title: 'lightGallery',
    titleSeparator: '-',
    titleAddition: 'Full featured javascript gallery for web and mobile.',
    description:
        'lightGallery supports features such as, Animated thumbnails, Pinch / double tap to zoom, HTML5 videos, YouTube, VImeo, videos, social media share, Rotate, fullScreen and many more. ',
    baseUrl: 'https://www.lightgalleryjs.com/',
    images: ['lightgallery.png'],
    twitterSite: '@sachinchoolur',
    twitterCreator: '@sachinchoolur',
    facebookAuthor: 'sachinchoolur',
    facebookPublisher: 'sachinchoolur',
    ogLocale: 'en_US',
    schemaType: 'Organization',
    schemaLogo: 'logo-hyas.png',
    schemaTwitter: 'https://twitter.com/SachinNeravath',
    schemaLinkedIn: 'https://www.linkedin.com/in/sachinchoolur/',
    schemaGitHub: 'https://github.com/sachinchoolur',
    schemaSection: 'blog',
    docsRepo: 'https://github.com/sachinchoolur/lightGallery/tree/master',
    themeColor: '#fff',
    ahrefsVerification:
        '96bd744dcfe6c078a1994c8d9e0e0ca6a5cf16004f63946a0cd349ca937c1b24',
} as const;

export interface MenuItem {
    name: string;
    url: string;
}

/**
 * Top navigation (Hugo `menus.toml` [[main]]). The three framework items
 * share weight 50, which Hugo breaks alphabetically, hence
 * Angular/React/Vue order.
 */
export const MAIN_MENU: MenuItem[] = [
    { name: 'Docs', url: '/docs/getting-started/' },
    { name: 'Demos', url: '/demos/thumbnails/' },
    { name: 'Angular', url: '/docs/angular-image-video-gallery/' },
    { name: 'React', url: '/docs/react-image-video-gallery/' },
    { name: 'Vue', url: '/docs/vue-image-video-gallery/' },
    { name: 'License', url: '/license/' },
];

/** The framework nav items highlight on their own docs page only. */
export const FRAMEWORK_NAV_SLUGS: Record<string, string> = {
    React: 'react-image-video-gallery',
    Vue: 'vue-image-video-gallery',
    Angular: 'angular-image-video-gallery',
};

export const SOCIAL_MENU: MenuItem[] = [
    { name: 'GitHub', url: 'https://github.com/sachinchoolur/lightGallery' },
];
