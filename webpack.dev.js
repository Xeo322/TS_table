const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devServer: {
        static: {
            directory: './dist',
        },
        compress: true,
        port: 9000,
        open: true,
    },
});
