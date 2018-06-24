/// ShipShape -> app.js
/// 	The main app entry point.  Links up all the other stuff.

const express = require('express');
const app     = express();

const morgan  = require('morgan');
const path    = require('path');

const routers = {
	index : [ '/', require('./app/routers/index.js') ],
};


// Determine whether or not we are running in a development environment.
let dev = process.env.NODE_ENV != 'production';

// Use Morgan for logging (even in production).
app.use(morgan('dev'));

// Configure views and the view engine.
app.set('view engine', 'ejs');
app.set('views', 'app/views');
app.set('view options', {
	delimiter: '$'
});

// Enable livereload support in development.
if (dev) app.use(require('connect-livereload')());


// Connect routers.
for (let index = 0; index < Object.keys(routers).length; index++) {
	let router = routers[Object.keys(routers)[index]];
	app.use(...router);
}


// Serve resource files that have been processed.
app.use('/res', express.static(path.join(__dirname, 'res', 'dist')));

// Listen on port 3000, or what is specified in the PORT environment variable.
app.listen(process.env.PORT || 3000);

