#!/bin/sh

# At the moment of writing gulp doesn't handle thrown exceptions very well when watching for file modifications.
# This ensures the watch is up and running.

# https://github.com/gulpjs/gulp/issues/216

gulp build

until gulp watch
 do growlnotify -name gulp -m "gulp watch restarted" --image watch.png
 sleep 1
done