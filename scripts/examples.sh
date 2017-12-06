#!/usr/bin/env bash
sh ./scripts/build.sh
mkdir -p ./dist/examples
cp -v ./examples/textbind/index.html ./dist/examples/textbind.html
cp -v ./examples/textbind/index.css ./dist/examples/textbind.css
cp -v ./examples/textbind/index.js ./dist/examples/textbind-bundle.js

cp -v ./examples/cube/index.html ./dist/examples/cube.html
cp -v ./examples/cube/index.css ./dist/examples/cube.css
cp -v ./examples/cube/index.js ./dist/examples/cube-bundle.js