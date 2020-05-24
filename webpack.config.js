const HtmlWebpackPlugin = require('html-webpack-plugin');
const LicenseWebpackPlugin = require('license-webpack-plugin').LicenseWebpackPlugin;

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
            {
                test: /\.html$/,
                use: [{
                    loader: "html-loader",
                    options: {
                        minimize: true
                    }
                }]
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[contenthash].bundle.js',
        publicPath: '/'
    },
    plugins: [new HtmlWebpackPlugin({ base: "/", title: "Greenchat" }),
    new LicenseWebpackPlugin()],
    mode: "development",
    devServer: {
        compress: true,
        port: 9000,
        historyApiFallback: {
            index: "/"
        }
    }
};