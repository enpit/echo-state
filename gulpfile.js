/* eslint-disable */

var gulp = require('gulp'),
uglify = require('gulp-uglify'),
eslint = require('gulp-eslint'),
istanbul = require('gulp-istanbul'),
rename = require('gulp-rename'),
sourcemaps = require('gulp-sourcemaps'),
mocha = require('gulp-mocha'),
gzip = require('gulp-gzip'),
umd = require('gulp-umd');

gulp.task('lint', function () {
return gulp.src('./index.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('pre-test', [ 'build' ], function () {
return gulp.src('./dist/index.umd.js')
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('test', [ 'pre-test' ], function () {
return gulp.src('./tests/*.js')
    .pipe(mocha({ reporter: 'progress' }))
    .pipe(istanbul.writeReports({ reporters: [ 'text', 'html' ] }));
});

gulp.task('umd', function () {
return gulp.src('./index.js')
    .pipe(rename('index.umd.js'))
    .pipe(umd({
        exports: function (file) {
            return 'Channel';
        },
        templateName: 'returnExports',
        namespace: function () {
            return 'Channel';
        }
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build', [ 'umd' ], function () {
return gulp.src('./dist/index.umd.js')
    .pipe(rename('index.umd.min.js'))
    .pipe(sourcemaps.init())
        .pipe(uglify())
    .pipe(sourcemaps.write('./', {includeContent:false}))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('compress', [ 'build' ], function () {
return gulp.src('./dist/index.umd.min.js')
    .pipe(gzip())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('docs', function () {
return gulp.src([''])
    .pipe(jsdoc(require('./jsdoc.json')));
});

gulp.task('default', [ 'lint', 'test', 'build', 'compress', 'docs' ]);
