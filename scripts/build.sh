#!/usr/bin/env bash
node node_modules/webpack/bin/webpack.js && \
cp -v ./test/index.html ./dist/test.html
cp -v ./test/index-integration.html ./dist/test-integration.html

cp -v ./examples/textbind/index.html ./dist/textbind.html
cp -v ./examples/textbind/index.css ./dist/textbind.css
cp -v ./examples/textbind/index.js ./dist/textbind-bundle.js

cp -v ./examples/cube/index.html ./dist/cube.html
cp -v ./examples/cube/index.css ./dist/cube.css
cp -v ./examples/cube/index.js ./dist/cube-bundle.js