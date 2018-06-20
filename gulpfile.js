/// ShipShape -> gulpfile.js
/// 	Handles compilation of assets and launching of the Express server for
/// 	development.

const gulp         = require('gulp');
const gls          = require('gulp-live-server');

const sass         = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

const babel        = require('gulp-babel');

const concat       = require('gulp-concat');
const sourcemaps   = require('gulp-sourcemaps');
const noop         = require('gulp-noop');


// Determine whether or not we are running in a development environment.
let dev = process.env.NODE_ENV != 'production';

// Build CSS files from SCSS files using the 'node-sass-import-once' importer.
gulp.task('build-css', () =>
	gulp.src('res/scss/**/*.scss')
		// If we are in development, initialize the sourcemaps.
		.pipe(dev ? sourcemaps.init() : noop())
		// Compile the SCSS.
		.pipe(sass({
			// We don't want to import files more than once.
			importer       : require('node-sass-import-once'),
			importOnce     : {
				index : false,
				css   : true,
				bower : false
			},
			// We are using SCSS and not SASS.
			indentedSyntax : false,
			// Generate minified CSS in production.
			outputStyle    : dev ? 'nested' : 'compressed'
		}).on('error', sass.logError))
		// Add vendor prefixes when necessary.
		.pipe(autoprefixer({
			// Don't use "visual cascade" when in production.
			cascade: dev ? true : false
		}))
		// Concatenate all CSS files into one file.
		.pipe(concat('index.css'))
		// Write the finished sourcemaps if we are in development.
		.pipe(dev ? sourcemaps.write('./') : noop())
		// Output the compiled CSS files.
		.pipe(gulp.dest('res/dist/'))
);

// Transpile JS files using Babel.
gulp.task('build-js', () =>
	gulp.src('res/js/**/*.es6.js')
		// If we are in development, initialize the sourcemaps.
		.pipe(dev ? sourcemaps.init() : noop())
		// Transpile the JS using the 'env' preset.
		.pipe(babel({
			presets : [ 'env' ]
		}))
		// Concatenate all of the resulting JS files into one file.
		.pipe(concat('index.js'))
		// Minify the CSS if we're in production.
		.pipe(dev ? noop() : uglify().on('error', sass.logError))
		// Write the sourcemaps if we are in development.
		.pipe(dev ? sourcemaps.write('./') : noop())
		// Output the compiled JS files.
		.pipe(gulp.dest('res/dist/'))
);

// Build both CSS and JS in parallel.
gulp.task('build', gulp.parallel('build-css', 'build-js'));


// Run the server with LiveReload (if in development).
gulp.task('server', () => {
	// Create the server from our 'app.js' file.
	let server = gls.new('app.js');
	// If the SCSS changes, compile it and notify LiveReload.
	gulp.watch('res/scss/**/*.scss').on('change', (file) =>
		gulp.series('build-css', server.notify.bind(server, file)));
	// If the JS changes, compile it and notify LiveReload.
	gulp.watch('res/js/**/*.es6.js').on('change', (file) =>
		gulp.series('build-js',  server.notify.bind(server, file)));
	gulp.watch([ 'app.js', 'app/**/*' ], () => server.start());
	server.start();
});

// Build all files and then start the server (if in development).
gulp.task('default', gulp.series('build', dev ? 'server' : undefined));

