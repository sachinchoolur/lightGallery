const { cd, exec, echo, touch } = require('shelljs');
const { readFileSync } = require('fs');
const colors = require('colors/safe');
const pkg = JSON.parse(readFileSync('package.json') as any);

const tarballName = `${pkg.name}-${pkg.version}.tgz`;

try {
    process.chdir('dist');
    exec('npm pack');
    exec(`npm publish ${tarballName}`);
    process.chdir('../');
    console.log(colors.green('Successfully published to npm!', tarballName));
} catch (error) {
    console.error('Error occurred:', error);
}
