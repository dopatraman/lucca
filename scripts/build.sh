#!/usr/bin/env bash
node node_modules/webpack/bin/webpack.js && \
cp -v ./test/index.html ./dist/test.html