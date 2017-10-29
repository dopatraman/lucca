#!/usr/bin/env bash
node node_modules/webpack/bin/webpack.js && \
cp -v ./test/index.html ./dist/test.html
cp -v ./test/index-integration.html ./dist/test-integration.html