const path = require('path');
const { readFileSync, writeFileSync } = require('fs');
const pkg = JSON.parse(readFileSync('package.json') as any);
const distPkg = JSON.parse(
    readFileSync(path.resolve(__dirname, '../dist', 'package.json')),
);

distPkg.version = pkg.version;

writeFileSync(
    path.resolve(__dirname, '../dist', 'package.json'),
    JSON.stringify(distPkg, null, 2),
);
