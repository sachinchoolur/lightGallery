/**
 * The five packages that ship together, shared by the release tool and the
 * consumer-app check.
 */
export const HEADLESS = '@lightgallery/headless';

// Publish order: headless first, the framework packages depend on it.
// `headless` is the range each package must carry for it once packed.
export const PACKAGES = [
    { name: HEADLESS, dir: 'packages/headless' },
    { name: '@lightgallery/react', dir: 'packages/react', headless: 'exact' },
    { name: '@lightgallery/vue', dir: 'packages/vue', headless: 'exact' },
    {
        name: '@lightgallery/angular',
        dir: 'packages/angular',
        // ng-packagr writes the publishable package, manifest included.
        packDir: 'packages/angular/dist',
        headless: 'caret',
        // Its entries need the Angular compiler; CI builds a scratch app.
        skipImport: true,
    },
    { name: 'lightgallery', dir: '.' },
];
