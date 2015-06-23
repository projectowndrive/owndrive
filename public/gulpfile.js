var gulp = require('gulp');
var uglify = require('gulp-uglify');
var filter = require('gulp-filter');
var compass = require('gulp-compass');
var order = require("gulp-order");
var mainBowerFiles = require('main-bower-files');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var connect = require('gulp-connect');

gulp.task('connect', function () {
	connect.server({
		root: '.',
		livereload: true
	});
});

gulp.task('html', function () {
	gulp.src('./**/*.html')
		.pipe(connect.reload());
});

var filterByExtension = function (extension) {
	return filter(function (file) {
		return file.path.match(new RegExp('.' + extension + '$'));
	});
};

gulp.task('bower', function () {
	var mainFiles = mainBowerFiles();
	if (!mainFiles.length) {
		return;
	}
	var jsFilter = filterByExtension('js');

	return gulp.src(mainFiles)
		.pipe(jsFilter)
		.pipe(concat('lib.js'))
		.pipe(gulp.dest('./js'))
		.pipe(jsFilter.restore())
		.pipe(filterByExtension('css'))
		.pipe(concat('lib.css'))
		// .pipe(minifyCSS({keepBreaks:true}))
		.pipe(gulp.dest('./css'));
});

gulp.task('compass', function () {
	gulp.src('./sass/**/*.scss')
		.pipe(compass({
			config_file: './config.rb',
			css: 'css',
			sass: 'sass'
		}))
		//.pipe(connect.reload())

	// .pipe(minifyCSS({keepBreaks:true}))
	.pipe(gulp.dest('css'));

});

gulp.task('js', function () {
	var files = [
		'./js/app/modules.js',
		'./js/app/services/*.js',
		'./js/app/controllers/*.js',
		'./js/app/directives/*.js',
		'./js/app/config.js'
	];
	//
	//	for (var i = files.length - 1; i >= 0; i--) {
	// 		gulp.src(files[i])
	// 			.pipe(jshint('.jshintrc'))
	// 			.pipe(jshint.reporter('jshint-stylish'));
	// 	};

	gulp.src(files)
		.pipe(concat('app.js', {
			newLine: '\r\n'
		}))
		//.pipe(connect.reload())

	//		.pipe(uglify())
	.pipe(gulp.dest('./js'));
});

gulp.task('watch', function () {
	gulp.watch('./sass/**/*.scss', ['compass']);
	gulp.watch('./js/app/**/*.js', ['js']);
	gulp.watch('./bower.json', ['bower']);

});


//gulp.task('default', ['compass', 'js', 'bower', 'watch']);
gulp.task('default', ['compass', 'js', 'bower', 'watch']);