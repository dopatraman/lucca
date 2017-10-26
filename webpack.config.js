const path = require('path');
var glob = require("glob");

module.exports = [
    {
        name:'source',
        entry: './src/index.ts',
        devtool: 'inline-source-map',
        module: {
            rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
            ]
        },
        resolve: {
            extensions: [ ".ts", ".js" ]
        },
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'dist')
        }
    },
    {
        name:'test',
        entry: glob.sync("./test/**/*.js"),
        module: {
            rules: [
            {
                test: /\.js$/
            }
            ]
        },
        resolve: {
            extensions: [ ".js" ]
        },
        output: {
            filename: 'test-bundle.js',
            path: path.resolve(__dirname, 'dist')
        }
    }
];