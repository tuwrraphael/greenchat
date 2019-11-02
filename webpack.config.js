const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/index.ts',
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        path: path.resolve(__dirname, 'assets'),
        publicPath: '/assets/'
    },
    plugins: [new HtmlWebpackPlugin({ filename: "../index.html" })],
    mode:"production",
    devServer: {
        contentBase: path.join(__dirname, './'),
        compress: true,
        port: 9000
    }
};