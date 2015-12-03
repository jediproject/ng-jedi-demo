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
    rename = require('gulp-rename');

var isProduction = argv.env === 'master' || argv.env === 'mirror';


gulp.task('default', ['assets'], function () {
    var a = 1;// place code for your default task here
});

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
gulp.task('build', ['cleanbuild', 'assets'], function () {

    var app = gulp.src(['**/*.*', '!**/*.tpl.*', '!**/env/*.json', '**/env/*-env.json'], { cwd: 'app/' })
    if (isProduction) {
        var filterAppCss = filter(['**/*.css', '!.min.*'], { restore: true });
        app.pipe(filterAppCss)
            .pipe(minifyCss())
            .pipe(rename({ suffix: '.min' }))
            .pipe(filterAppCss.restore);

        var filterAppJs = filter(['**/*.js', '!.min.*'], { restore: true });
        app.pipe(filterAppJs)
            .pipe(uglify())
            .pipe(rename({ suffix: '.min' }))
            .pipe(filterAppJs.restore);
    }
    app.pipe(gulp.dest('build/app/'));

    var assets = gulp.src(['**/*.*'], { cwd: 'assets/' })
    if (isProduction) {
        var filterAssetsCss = filter(['**/*.css', '!.min.*'], { restore: true });
        assets.pipe(filterAssetsCss)
            .pipe(minifyCss())
            .pipe(rename({ suffix: '.min' }))
            .pipe(filterAssetsCss.restore)

        var filterAssetsJs = filter(['**/*.js', '!.min.*'], { restore: true });
        assets.pipe(filterAssetsJs)
            .pipe(uglify())
            .pipe(rename({ suffix: '.min' }))
            .pipe(filterAssetsJs.restore)
    }
    assets.pipe(gulp.dest('build/assets/'));

    var build = gulp.src(['favicon.ico', 'index.html', 'main.tpl.js', 'version.tpl.json'])
        .pipe(rename(function (path) {
            path.basename = path.basename.replace('.tpl', '');
        }))
        .pipe(gulp.dest('build/'));

    return merge(app, assets, build);
});
