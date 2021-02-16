/// ShipShape -> gulpfile.js
/// 	Handles compilation of assets and watching files for recompilation.


// Determine whether or not we are running in a development environment.
let dev = process.env.NODE_ENV != 'production';

const gulp         = require('gulp');

const sass         = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

const babel        = require('gulp-babel');

const concat       = require('gulp-concat');
const noop         = require('gulp-noop');
const sourcemaps   = dev ? require('gulp-sourcemaps') : null;
const uglify       = require('gulp-uglify');

sass.compiler = require("node-sass");

// Build CSS files from SCSS files using the 'node-sass-import-once' importer.
gulp.task('build-css', () =>
	gulp.src('app/res/scss/**/*.scss')
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
		.pipe(gulp.dest('res/'))
);

// Transpile JS files using Babel.
gulp.task('build-js', () =>
	gulp.src('app/res/js/**/*.js')
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
		.pipe(gulp.dest('res/'))
);

// Build both CSS and JS in parallel.
gulp.task('build', gulp.parallel('build-css', 'build-js'));

// Watch resource files and compile them if changed.
gulp.task('watch', () => {
	// If the SCSS changes, compile it.
	gulp.watch('app/res/scss/**/*.scss', gulp.task('build-css'));
	// If the JS changes, compile it.
	gulp.watch('app/res/js/**/*.js',     gulp.task('build-js'));
});

// Build all files and then start watching files (if in development).
gulp.task('default', gulp.series('build', dev ? 'watch' : (callback) => { callback(); }));

