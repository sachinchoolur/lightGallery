const fs = require('fs-extra');
const colors = require('colors/safe');

try {
    fs.copySync('CNAME', 'public/CNAME');
    console.log(colors.green('Success!'));
} catch (err) {
    console.log(colors.red(err));
}
// copy directory, even if it has subdirectories or files
