#!/bin/bash

set -e
rm -r package
grunt package:angularBlockUI
grunt package:angularBlockUI --target=release

echo '/* Copyright (c) 2013-2014, Null McNull https://github.com/McNull, LICENSE: MIT */' | cat - package/angular-block-ui/angular-block-ui.js > tmp.js && mv tmp.js package/angular-block-ui/angular-block-ui.js
echo '/* Copyright (c) 2013-2014, Null McNull https://github.com/McNull, LICENSE: MIT */' | cat - package/angular-block-ui/angular-block-ui.min.js > tmp.js && mv tmp.js package/angular-block-ui/angular-block-ui.min.js

cp LICENSE package/angular-block-ui/
cp README.md package/angular-block-ui/
cp bower.json package/angular-block-ui/

# git subtree split --prefix package/angular-block-ui --branch bower
