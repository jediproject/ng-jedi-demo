var gulp = require('gulp');
var addsrc = require('gulp-add-src');
var argv = require('yargs').argv;
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var change = require('gulp-change');
var clean = require('gulp-clean');
var file = require('gulp-file');
var flatten = require('gulp-flatten');
var fs = require('fs');
var glob = require("glob");
var gulpif = require('gulp-if');
var jshint = require('gulp-jshint');
var merge = require('merge-stream');
var minifyCss = require('gulp-minify-css');
var path = require('path');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var replaceTask = require('gulp-replace-task');
var revReplace = require('gulp-rev-replace');
var rev = require('gulp-rev');
var sass = require('gulp-sass');
var sprity = require('sprity');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');

var assets = require('./assetsfiles.json');
var packageJSON = require('./package');
var jshintConfig = packageJSON.jshintConfig;

var appFolder = './app/';
var buildFolder = './build/';
var version = { version: '0.0.1', files: {} };
var isProduction = argv.env === 'master' || argv.env === 'mirror';
argv.env = argv.env ? argv.env : 'develop';

gulp.task('default', ['clean', 'assets', 'setEnvironment'], function () { });

// Clean Build
gulp.task('clean', function () {
    return gulp.src(['assets/libs', 'assets/css/*', 'assets/fonts', '!assets/css/app.css', '!assets/css/sprite.css'])
        .pipe(clean());
});

// Clean Build
gulp.task('cleanBuild', function () {
    return gulp.src([buildFolder + '*'])
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
        .pipe(autoprefixer())
        .pipe(gulp.dest('./assets/css'));

    var versionFile = file('version.json', JSON.stringify(version, null, 4), { src: true })
        .pipe(gulp.dest('./'));

    return merge(libs, css, fonts, scss, versionFile);
});

gulp.task('sprite', function () {
    return sprity.src({ src: ['./assets/img/*.png'], 
                        style: './assets/css/sprite.css',
                        cssPath: './assets/img/sprite/' })
        .pipe(gulpif('*.png', gulp.dest('./assets/img/sprite/'), gulp.dest('./assets/css/')));
});

gulp.task('sass', function () {
    return gulp.src('./assets/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./assets/css'))
        .pipe(browserSync.stream());
});

gulp.task('setEnvironment', function () {
    // Get modules from folders inside "./app/"
    var modules = getModules();
    for (var i = 0; i < Object.keys(modules).length; i++) {
        // Read environment specific settings
        var jsonEnv = require(appFolder + modules[i] + '/env/' + modules[i] + '-env.' + argv.env + '.json');

        // Replace settings in template
        gulp.src(appFolder + modules[i] + '/env/' + modules[i] + '-env.tpl.json')
            .pipe(replaceTask({ patterns: [{ json: jsonEnv }] }))
            .pipe(rename(modules[i] + '-env.json'))
            .pipe(gulp.dest(appFolder + modules[i] + '/env/'));
    }
});

// Run App files Build / Buildmin
gulp.task('build', ['clean', 'cleanBuild', 'assets', 'setEnvironment'], function () {
    // Random version file for each build
    var versionName = 'version-' + Math.random().toString(36).substring(8) + '.json';
    var versionFileRegx = new RegExp(versionName, "g");

    return gulp.src(['**/*.*', '!**/*.tpl.*', '!**/env/*.*'], { cwd: appFolder, base: './' })
        .pipe(gulpif(/\.js$/, jshint(jshintConfig)))                                                // JSHint only JS files from project
        .pipe(jshint.reporter(stylish))                                                             // Better output for lint errors
        .pipe(jshint.reporter('fail'))                                                              // Raise exception on lint error
        .pipe(addsrc(['favicon.ico', 'main.js', '**/env/*-env.json']))                              // Add root project folder files
        .pipe(addsrc(['**/*.*', '!**/*.scss', '!img/dogs/*.*'], { cwd: 'assets/', base: './' }))    // Add assets files
        .pipe(gulpif(/\.js$/, gulpif(isProduction, uglify())))                                      // Uglify all JS files
        .pipe(gulpif(/\.css$/, gulpif(isProduction, minifyCss())))                                  // Minify all CSS files
        .pipe(rev())                                                                                // Versioning for cache bust
        .pipe(addsrc(['index.html', '**/img/dogs/*.*']))                                            // Add files that can't be reved.
        .pipe(revReplace({ modifyUnreved: modifyToReplace, modifyReved: modifyToReplace }))         // Replace rev references
        .pipe(gulpif(/main\-[0-9a-z]+\.js$/, replace('version.json', versionName)))                 // Replace version reference in main-*.js
        .pipe(gulp.dest(buildFolder))                                                               // Build output
        .pipe(rev.manifest(versionName, { merge: true }))                                           // Create manifest file
        .pipe(gulpif(versionFileRegx, change(modifyManifest)))                                      // Change manifest structure to mach previous version.
        .pipe(gulp.dest(buildFolder));                                                              // Manifest output
});

gulp.task('watch', ['sass:watch', 'build:watch', 'assets:watch'], function () { });

// Watch task to build app/
gulp.task('build:watch', function () {
    return watch(['**/*.*', '!**/*.tpl.*', '!**/env/*.*'], { cwd: appFolder, base: './' })
        .pipe(gulpif(/\.js$/, jshint(jshintConfig)))
        .pipe(jshint.reporter(stylish))
        .pipe(gulpif(/\.js$/, gulpif(isProduction, uglify())))
        .pipe(gulpif(/\.css$/, gulpif(isProduction, minifyCss())))
        .pipe(rename(setVersionFileName))
        .pipe(gulp.dest(buildFolder));
});

gulp.task('assets:watch', function () {
    return watch(['**/*.css'], { cwd: 'assets/', base: './' })
        .pipe(gulpif(/\.css$/, gulpif(isProduction, minifyCss())))
        .pipe(rename(setVersionFileName))
        .pipe(gulp.dest(buildFolder));
});

// Watch Sass files to compile Css
gulp.task('sass:watch', function () {
    return watch('./assets/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./assets/css'));
});

// Static server
gulp.task('serve', ['build'], function() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        port: 8080
    });
    
    gulp.watch('app/**/*').on('change', browserSync.reload);
    gulp.watch('assets/sass/**/*', ['sass']);
});

// Get modules from directories inside ./app/ folder
function getModules() {
    return fs.readdirSync(appFolder).filter(function (file) {
        return fs.statSync(path.join(appFolder, file)).isDirectory();
    });
}

// Modify manifest to template
function modifyManifest(content) {
    var files = JSON.parse(content);
    version.files = files;
    return JSON.stringify(version, null, 4);
}

// Remove optional paths in search for replace revved files
function modifyToReplace(filename) {
    if (filename.indexOf('/') > -1) filename = filename.replace(/\.js$/, '');
    return filename.replace('assets', '').replace(/^\/+/g, '');
}

// Rename file to versioned name
function setVersionFileName(file) {
    var version = require(glob.sync(buildFolder + 'version*.json')[0]);
    var versionedFileName = version.files[path.posix.join(file.dirname.replace('\\', '/'), file.basename + file.extname)];
    return file.basename = path.basename(versionedFileName, path.extname(versionedFileName));
}