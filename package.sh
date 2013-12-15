#!/bin/bash

echo $PATH
rm -r package
grunt package:angularBlockUI
grunt package:angularBlockUI --target=release
