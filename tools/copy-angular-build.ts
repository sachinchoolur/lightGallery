const fs = require('fs-extra');
const colors = require('colors/safe');

(async function main() {
    fs.copySync('lightgallery-angular/latest/dist', 'dist/angular');
    fs.moveSync('dist/angular/lightgallery-angular', 'dist/angular');
    console.log(colors.green('Copied latest angular dist!'));
    fs.copySync('lightgallery-angular/11/dist', 'dist/angular/11');
    fs.moveSync('dist/angular/11/lightgallery-angular', 'dist/angular/11');
    console.log(colors.green('Copies angular 11 dist!'));
    fs.copySync('lightgallery-angular/10/dist', 'dist/angular/10');
    fs.moveSync('dist/angular/10/lightgallery-angular', 'dist/angular/10');
    console.log(colors.green('Copies angular 10 dist!'));
    fs.copySync('lightgallery-angular/9/dist', 'dist/angular/9');
    fs.moveSync('dist/angular/9/lightgallery-angular', 'dist/angular/9');
    console.log(colors.green('Copies angular 9 dist!'));
})().catch((error) => {
    process.exitCode = 1;
    console.log(colors.red(error));
});
