#!/usr/bin/env bash
unamestr=`uname`
if [[ "$unamestr" == 'Darwin' ]]; then
    open ./dist/test/test.html
else
    xdg-open ./dist/test/test.html
fi
