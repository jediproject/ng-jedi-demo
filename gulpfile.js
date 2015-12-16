var gulp = require('gulp');
var addsrc = require('gulp-add-src');
var argv = require('yargs').argv;
var change = require('gulp-change');
var clean = require('gulp-clean');
var filter = require('gulp-filter');
var flatten = require('gulp-flatten');
var fs = require('fs');
var glob = require("glob");
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var lazypipe = require('lazypipe');
var merge = require('merge-stream');
var minifyCss = require('gulp-minify-css');
var path = require('path');
var print = require('gulp-print');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var replaceTask = require('gulp-replace-task');
var revReplace = require('gulp-rev-replace');
var rev = require('gulp-rev');
var sass = require('gulp-sass');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var protractor = require("gulp-protractor").protractor

var assets = require('./assetsfiles.json');
var packageJSON = require('./package');
var jshintConfig = packageJSON.jshintConfig;

var isProduction = argv.env === 'master' || argv.env === 'mirror';
argv.env = argv.env ? argv.env : 'develop'

gulp.task('default', ['clean', 'assets', 'setEnvironment'], function () { });

// Clean Build
gulp.task('clean', function () {
    return gulp.src(['assets/libs', 'assets/css/*', 'assets/fonts', '!assets/css/app.css'])
        .pipe(clean());
});

// Clean Build
gulp.task('cleanBuild', function () {
    return gulp.src(['build/*'])
        .pipe(clean());
});

// Copy needed assets files before build
gulp.task('assets', ['clean'], function () {
    var libs = gulp.src(assets.libs.src, { base: 'bower_components/' })
        .pipe(flatten({ includeParents: 1 }))
        .pipe(gulp.dest(assets.libs.dest));

    var css = gulp.src(assets.css.src)
        .pipe(gulp.dest(assets.css.dest));

    var fonts = gulp.src(assets.fonts.src)
        .pipe(gulp.dest(assets.fonts.dest));

    var scss = gulp.src('./assets/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./assets/css'));

    return merge(libs, css, fonts, scss);
});

gulp.task('setEnvironment', function () {
    // Get modules from folders inside "./app/"
    var modules = getModules();
    for (var i = 0; i < Object.keys(modules).length; i++) {
        // Read environment specific settings
        var jsonEnv = require('./app/' + modules[i] + '/env/' + modules[i] + '-env.' + argv.env + '.json');

        // Replace settings in template
        gulp.src('app/' + modules[i] + '/env/' + modules[i] + '-env.tpl.json')
            .pipe(replaceTask({ patterns: [{ json: jsonEnv }] }))
            .pipe(rename(modules[i] + '-env.json'))
            .pipe(gulp.dest('app/' + modules[i] + '/env/'));
    }
});

// Run App files Build / Buildmin
gulp.task('build', ['clean', 'cleanBuild', 'assets', 'setEnvironment'], function () {
    // Random version file for each build
    var versionName = 'version-' + Math.random().toString(36).substring(8) + '.json';
    var regx = new RegExp(versionName, "g");

    return gulp.src(['**/*.*', '!**/*.tpl.*', '!**/env/*.*'], { cwd: 'app/', base: './' })
        .pipe(gulpif(/\.js$/, jshint(jshintConfig)))                                        // JSHint only JS files from project
        .pipe(jshint.reporter(stylish))                                                     // Better output for lint errors
        .pipe(jshint.reporter('fail'))                                                      // Raise exception on lint error
        .pipe(addsrc(['favicon.ico', 'main.js', '**/env/*-env.json']))                      // Add root project folder files
        .pipe(addsrc(['**/*.*', '!img/dogs/*.*'], { cwd: 'assets/', base: './' }))          // Add assets files
        .pipe(gulpif(/\.js$/, gulpif(isProduction, uglify())))                              // Uglify all JS files
        .pipe(gulpif(/\.css$/, gulpif(isProduction, minifyCss())))                          // Minify all CSS files
        .pipe(rev())                                                                        // Versioning for cache bust
        .pipe(addsrc(['index.html', '**/img/dogs/*.*']))                                    // Add files that can't be reved.
        .pipe(revReplace({ modifyUnreved: modifyToReplace, modifyReved: modifyToReplace })) // Replace rev references
        .pipe(gulpif(/main\-[0-9a-z]+\.js$/, replace('version.json', versionName)))         // Replace version reference in main-*.js
        .pipe(gulp.dest('build/'))                                                          // Build output
        .pipe(rev.manifest(versionName, { merge: true }))                                   // Create manifest file
        .pipe(gulpif(regx, change(modifyManifest)))                                         // Change manifest structure to mach previous version.
        .pipe(gulp.dest('build/'));                                                         // Manifest output
});

gulp.task('jshint:watch', function () {
    return gulp.src('app/**/*.js')
        .pipe(watch('app/**/*.js'))
        .pipe(jshint(jshintConfig))
        .pipe(jshint.reporter(stylish));
});

gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

// ToDo: program tests tasks
gulp.task('protractor', function () {
    gulp.src('files')
        .pipe(protractor({
            configFile: 'test/e2e/protractor-conf.js'
        }))
        .on('error', function (e) { throw e })
});

// Get modules from directories inside ./app/ folder
function getModules() {
    return fs.readdirSync('./app').filter(function (file) {
        return fs.statSync(path.join('./app', file)).isDirectory();
    });
}

// Modify manifest to template
function modifyManifest(content) {
    var files = JSON.parse(content);
    var version = { version: '0.0.1', files: files };
    return JSON.stringify(version, null, 4);
}

// Remove optional paths in search for replace revved files
function modifyToReplace(filename) {
    if (filename.indexOf('/') > -1) filename = filename.replace(/\.js$/, '');
    return filename.replace('assets', '').replace(/^\/+/g, '');
}