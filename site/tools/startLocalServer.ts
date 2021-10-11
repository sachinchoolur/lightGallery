const ip = require('ip');
const { exec } = require('shelljs');

const colors = require('colors/safe');

try {
    const ipAddress = ip.address();
    exec(`hugo server --bind=${ipAddress} --baseURL=http://${ipAddress}:5757`);
    console.log(colors.green('Success!'));
} catch (err) {
    console.log(colors.red(err));
}
