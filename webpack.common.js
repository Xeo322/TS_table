const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './sources/ts/app.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,  // для SCSS файлов
                use: [
                    'style-loader', // Вставляет стили в DOM
                    'css-loader',   // Преобразует CSS в CommonJS
                    'sass-loader',  // Компилирует SCSS в CSS
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './sources/index.html',
        }),
    ],
};
