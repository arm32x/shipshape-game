#!/usr/bin/bash

if [ "$NODE_ENV" = "production" ]; then
	gulp build
	node app.js
else
	gulp &
	nodemon app.js --watch app.js --watch app/ --ignore app/res/ &
	wait
fi
