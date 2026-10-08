#!/usr/bin/env node
/**
 * Guards `pack` and `publish`: a package packed before its build has no
 * dist/ and is published empty.
 *
 *   node assert-built.mjs <file>...     fail unless every file exists
 *   node assert-built.mjs --refuse <m>  always fail with the message
 */
import { existsSync } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const name = process.env.npm_package_name ?? 'this package';

if (args[0] === '--refuse') {
    console.error(`Refusing to pack ${name}: ${args.slice(1).join(' ')}`);
    process.exit(1);
}

const missing = args.filter((file) => !existsSync(path.resolve(file)));
if (missing.length > 0) {
    console.error(
        `Refusing to pack ${name}: build output is missing (${missing.join(', ')}). Run the build first.`,
    );
    process.exit(1);
}
