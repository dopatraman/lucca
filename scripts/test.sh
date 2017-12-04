#!/usr/bin/env bash
sh ./scripts/build.sh
cp -v ./test/index.html ./dist/test.html
cp -v ./test/index-integration.html ./dist/test-integration.html
sh ./scripts/open_browser.sh