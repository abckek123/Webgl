const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    mode: 'development',
    entry: './src/main.ts',
    devtool: 'source-map',
    devServer: {
        watchOptions: {
            ignored: /node_modules/
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html'
        })
    ],
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            use: "awesome-typescript-loader"
        }, {
            test: /\.(jpg|png|gif|bmp|svg)$/,
            exclude: /node_modules/,
            include: path.join(__dirname, 'image'),
            use: "url-loader"
        }]
    },
    resolve: {
        extensions: ['.ts', '.js', '.json', '.html']
    }
};