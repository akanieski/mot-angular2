"use strict";

let gulp = require("gulp");
let del = require("del");
let tsc = require("gulp-typescript");
let sourcemaps = require('gulp-sourcemaps');
let tsProject = tsc.createProject("tsconfig.json");
let tslint = require('gulp-tslint');
let ncp = require('ncp').ncp;
/**
 * Remove build directory.
 */
gulp.task('clean', (cb) => {
    return del(["build"], cb);
});

/**
 * Lint all custom TypeScript files.
 */
gulp.task('tslint', () => {
    return gulp.src("src/**/*.ts")
        .pipe(tslint())
        .pipe(tslint.report('prose'));
});

/**
 * Compile TypeScript sources and create sourcemaps in build directory.
 */
gulp.task("compile", ["tslint"], () => {
    let tsResult = gulp.src("src/**/*.ts")
        .pipe(sourcemaps.init())
        .pipe(tsc(tsProject));
    return tsResult.js
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("www"));
});

/**
 * Copy all resources that are not TypeScript files into build directory.
 */
gulp.task("resources", () => {
    return gulp
        .src([
            "src/**/*", 
            "!**/*.ts",
            "node_modules/bootswatch/flatly/bootstrap.min.css",
            "node_modules/font-awesome/css/font-awesome.min.css"
        ])
        .pipe(gulp.dest("www"));
});

/**
 * Copy fonts
 */
gulp.task('fonts', function() {
    return gulp.src([
                    'node_modules/font-awesome/fonts/fontawesome-webfont.*'])
            .pipe(gulp.dest('www/fonts'));
});

/**
 * Copy all required libraries into build directory.
 */
gulp.task("libs", () => {
    return gulp.src([
            'jquery/dist/jquery.min.js',
            'bootstrap/dist/bootstrap.min.js',
            'es6-shim/es6-shim.min.js',
            'systemjs/dist/system-polyfills.js',
            'angular2/bundles/angular2-polyfills.js',
            'systemjs/dist/system.src.js',
            'rxjs/bundles/Rx.js',
            'angular2/bundles/angular2.dev.js',
            'angular2/bundles/router.dev.js',
            'angular2/bundles/http.dev.js'
        ], {cwd: "node_modules/**"}) /* Glob required here. */
        .pipe(gulp.dest("www/lib"));
});

/**
 * Watch for changes in TypeScript, HTML and CSS files.
 */
gulp.task('watch', function () {
    gulp.watch(["src/**/*.ts"], ['compile']).on('change', function (e) {
        console.log('TypeScript file ' + e.path + ' has been changed. Compiling.');
    });
    gulp.watch(["src/**/*.html", "src/**/*.css"], ['resources']).on('change', function (e) {
        console.log('Resource file ' + e.path + ' has been changed. Updating.');
    });
});

/**
 * Build the project.
 */
gulp.task("build", ['compile', 'fonts', 'resources', 'libs'], () => {
    console.log("Building the project ...");
});

gulp.task("cordova-build", ['build'], (done) => {
    var exec = require('child_process').exec;
    exec('cordova build', done);
});