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
        name:'unittest',
        entry: glob.sync("./test/unit/**/*.spec.js"),
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
            filename: 'test-unit-bundle.js',
            path: path.resolve(__dirname, 'dist/test')
        }
    },
    {
        name:'integrationtest',
        entry: glob.sync("./test/integration/**/*.spec.js"),
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
            filename: 'test-integration-bundle.js',
            path: path.resolve(__dirname, 'dist/test')
        }
    }
];