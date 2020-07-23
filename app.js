/// ShipShape  >  app
/// 	The main app entry point.  Links up all the other stuff.

const express    = require('express');
const app        = express();

const morgan     = require('morgan');
const path       = require('path');
const bodyParser = require('body-parser');

const routers = {
	game  : [ '/game', require('./app/routers/game.js')  ],
	maps  : [ '/maps', require('./app/routers/maps.js')  ],
	index : [ '/',     require('./app/routers/index.js') ]
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

// Attach helpers for EJS views.
app.locals.helpers = require('./app/ejs-helpers.js');
app.locals.require = require;

// Parse form submissions.
app.use(bodyParser.urlencoded({ extended: false }));

// Connect routers.
for (let index = 0; index < Object.keys(routers).length; index++) {
	let router = routers[Object.keys(routers)[index]];
	app.use(...router);
}


// Serve resource files that have been processed.
app.use('/res', express.static(path.join(__dirname, 'res')));

// Listen on port 8080, or what is specified in the PORT environment variable.
let port = process.env.PORT || 8080;
let server = app.listen(port);
console.log(`Running ShipShape server on port ${port}.`)
