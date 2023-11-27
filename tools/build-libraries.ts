const { cd, exec, echo, touch } = require('shelljs');
const { readFileSync } = require('fs');
const url = require('url');
const colors = require('colors/safe');
const replace = require('replace-in-file');

(async function main() {
    process.chdir('lightgallery-react');
    exec('npm run build:library');
    console.log(colors.green('created react build!'));

    process.chdir('../lightgallery-vue');
    exec('npm run build:library');
    console.log(colors.green('created vue build!'));

    process.chdir('../lightgallery-angular/17');
    exec('npm run build:library');
    console.log(colors.green('created angular 17 build!'));

    process.chdir('../16');
    exec('npm run build:library');
    console.log(colors.green('created angular 16 build!'));

    process.chdir('../15');
    exec('npm run build:library');
    console.log(colors.green('created angular 15 build!'));

    process.chdir('../14');
    exec('npm run build:library');
    console.log(colors.green('created angular 14 build!'));

    process.chdir('../13');
    exec('npm run build:library');
    console.log(colors.green('created angular 13 build!'));

    process.chdir('../12');
    exec('npm run build:library');
    console.log(colors.green('created angular 12 build!'));


    process.chdir('../11');
    exec('npm run build');
    console.log(colors.green('created angular 11 build!'));


    process.chdir('../10');
    exec('npm run build');
    console.log(colors.green('created angular 10 build!'));

    process.chdir('../9');
    exec('npm run build');
    console.log(colors.green('created angular 9 build!'));

    process.chdir('../../lightgallery-lit');
    exec('npm run build');
    console.log(colors.green('created lit build!'));

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
