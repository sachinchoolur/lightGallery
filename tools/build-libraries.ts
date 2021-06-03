const { cd, exec, echo, touch } = require('shelljs');
const { readFileSync } = require('fs');
const url = require('url');
const colors = require('colors/safe');
const replace = require('replace-in-file');

process.chdir('lightgallery-react');
exec('npm run build:library');
process.chdir('../lightgallery-vue');
exec('npm run build:library');
process.chdir('../lightgallery-angular');
exec('npm run build:library');
process.chdir('../lightgallery-lit');
exec('npm run build');
process.chdir('../');
exec('npm run copyReactBuild');
exec('npm run copyVueBuild');
exec('npm run copyAngularBuild');
exec('npm run copyLitBuild');
try {
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
} catch (error) {
    console.error('Error occurred:', error);
}
