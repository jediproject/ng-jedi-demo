var gulp = require('gulp'),
    argv = require('yargs').argv,
    flatten = require('gulp-flatten'),
    assets = require('./assetsfilesgulp.json'),
    merge = require('merge-stream'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if'),
    minifyCss = require('gulp-minify-css'),
    filter = require('gulp-filter'),
    rename = require('gulp-rename'),
    lazypipe = require('lazypipe'),
    rev = require('gulp-rev'),
    revReplace = require('gulp-rev-replace'),
    jshint = require('gulp-jshint');

var isProduction = argv.env === 'master' || argv.env === 'mirror';

var jshintConfig = {
    globalstrict: true,
    curly: true,
    eqeqeq: true,
    eqnull: true,
    browser: true,
    strict: true,
    newcap: false,
    globals: {
        jQuery: true,
        angular: false,
        "$": false,
        "_": false,
        "jd": false,
        "define": false,
        "console": false,
        "moment": false
    }
};

// Clean Build
gulp.task('clean', function () {
    return gulp.src(['assets/libs', 'assets/css/*', 'assets/fonts', '!assets/css/app.css'])
        .pipe(clean());
})

// Clean Build
gulp.task('cleanbuild', function () {
    return gulp.src(['build/*'])
        .pipe(clean());
})

// Copy Assets
gulp.task('assets', ['clean'], function () {
    var libs = gulp.src(assets.libs.src, { base: 'bower_components/' })
        .pipe(flatten({ includeParents: 1 }))
        .pipe(gulp.dest(assets.libs.dest));

    var css = gulp.src(assets.css.src)
        .pipe(gulp.dest(assets.css.dest));

    var fonts = gulp.src(assets.fonts.src)
        .pipe(gulp.dest(assets.fonts.dest));

    return merge(libs, css, fonts);
});

// Run Build / Buildmin
gulp.task('appBuild', ['cleanbuild', 'assets'], function () {

    var app = gulp.src(['**/*.*', '!**/*.js', '!**/*.css', '!**/*.tpl.*', '!**/env/*.json', '**/env/*-env.json'], { cwd: 'app/' });

    var appJs = gulp.src(['**/*.js', '!**/*.tpl.*'], { cwd: 'app/' })
        .pipe(gulpif(isProduction, uglify()))
        .pipe(jshint(jshintConfig));

    var appCss = gulp.src(['**/*.css'], { cwd: 'app/' })
        .pipe(gulpif(isProduction, minifyCss()));

    return merge(app, appJs, appCss)
        .pipe(rev())
        .pipe(revReplace())
        .pipe(gulp.dest('build/app'))
        .pipe(rev.manifest('version.json', {
            base: 'build',
            merge: true
        }))
        .pipe(gulp.dest('build/app'));
});

// Run Build / Buildmin
gulp.task('assetsBuild', ['cleanbuild', 'assets'], function () {
    var assets = gulp.src(['**/*.*', '!*.js', '!*.css'], { cwd: 'assets/' });

    var assetsJs = gulp.src(['**/*.*', '!*.js', '!*.css'], { cwd: 'assets/' })
        .pipe(gulpif(isProduction, uglify()));

    var assetsCss = gulp.src(['**/*.*', '!*.js', '!*.css'], { cwd: 'assets/' })
        .pipe(gulpif(isProduction, minifyCss()));

    return merge(assets, assetsJs, assetsCss)
        .pipe(rev())
        .pipe(revReplace())
        .pipe(gulp.dest('build/assets'))
        .pipe(rev.manifest('version.json', {
            base: 'build',
            merge: true
        }))
        .pipe(gulp.dest('build/assets'));
});

gulp.task('build', ['appBuild', 'assetsBuild'], function () {
    return gulp.src(['favicon.ico', 'index.html', 'main.tpl.js', 'version.tpl.json'])
        .pipe(rename(function (path) {
            path.basename = path.basename.replace('.tpl', '');
        }));
});