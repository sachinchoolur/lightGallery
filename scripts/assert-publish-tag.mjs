#!/usr/bin/env node
/**
 * Guards `publish`: a prerelease published without an explicit dist-tag
 * lands on `latest`, where every plain `npm install` picks it up. Package
 * managers differ on whether they read `publishConfig.tag`, so the tag has
 * to be on the command line.
 */
const name = process.env.npm_package_name ?? 'this package';
const version = process.env.npm_package_version ?? '';
const tag = process.env.npm_config_tag;

if (version.includes('-') && (!tag || tag === 'latest')) {
    console.error(
        `Refusing to publish ${name}@${version}: a prerelease needs an explicit dist-tag. Run the publish again with --tag next.`,
    );
    process.exit(1);
}
