const { cd, exec, echo, touch } = require('shelljs');
const { readFileSync } = require('fs');
const url = require('url');
const colors = require('colors/safe');
const replace = require('replace-in-file');

(async function main() {
    process.chdir('lightgallery-react');
    exec('npm run build:library');
    process.chdir('../lightgallery-vue');
    exec('npm run build:library');
    process.chdir('../lightgallery-angular/14');
    exec('npm run build:library');
    process.chdir('../13');
    exec('npm run build:library');
    process.chdir('../12');
    exec('npm run build:library');
    process.chdir('../11');
    exec('npm run build');
    process.chdir('../10');
    exec('npm run build');
    process.chdir('../9');
    exec('npm run build');
    process.chdir('../../lightgallery-lit');
    exec('npm run build');
    process.chdir('../');
    exec('npm run copyReactBuild');
    exec('npm run copyVueBuild');
    exec('npm run copyAngularBuild');
    exec('npm run copyLitBuild');

    replace.sync({
        files: 'dist/react/Lightgallery.d.ts',
        from: /lightgallery\//g,
        to: '../',
    });
    replace.sync({
        files: 'dist/vue/LightGallery.vue.d.ts',
        from: /..\/..\/..\/src\//g,
        to: '../',
    });
    console.log(colors.green('Successfully created lightGallery build!'));
})().catch((error) => {
    process.exitCode = 1;
    console.log(colors.red(error));
});
