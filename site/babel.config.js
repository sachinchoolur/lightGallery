module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    browsers: [
                        // Best practice: https://github.com/babel/babel/issues/7789
                        '>=1%',
                        'ie >= 9',
                        'not op_mini all',
                    ],
                },
            },
        ],
    ],
};
