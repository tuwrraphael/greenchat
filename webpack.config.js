const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/index.ts',
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: [
                    'raw-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                includePaths: [path.resolve(__dirname, 'node_modules')]
                            }
                        }
                    }
                ]
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', ".scss"],
    },
    output: {
        path: path.resolve(__dirname, 'assets'),
        publicPath: '/assets/'
    },
    plugins: [new HtmlWebpackPlugin({ filename: "../index.html" })],
    mode: "production",
    devServer: {
        contentBase: path.join(__dirname, './'),
        compress: true,
        port: 9000
    }
};