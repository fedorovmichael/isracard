"use strict";

var path = require("path");
var WebpackNotifierPlugin = require("webpack-notifier");
var BrowserSyncPlugin = require("browser-sync-webpack-plugin");

module.exports = {
    entry: "./Scripts/Home/React/index.js",
    output: {
        path: path.resolve(__dirname, "./Scripts/Dist/Home/react"),
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.(js|css)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    devtool: "inline-source-map",
    plugins: [new WebpackNotifierPlugin(), new BrowserSyncPlugin()]
};