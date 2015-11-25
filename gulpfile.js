var gulp = require('gulp'),
    argv = require('yargs').argv,
    flatten = require('gulp-flatten'),
    assets = require('./assetsfilesgulp.json'),
    merge = require('merge-stream'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if'),
    minifyCss = require('gulp-minify-css'),
    gulpFilter = require('gulp-filter'),
    rename = require('gulp-rename');

var isProduction = argv.env === 'master' || argv.env === 'mirror';


gulp.task('default', function () {
    // place code for your default task here
    
});

gulp.task('clean', function () {
    return gulp.src('build')
        .pipe(clean());
})

gulp.task('assets', function () {
    var filterJSMin = gulpFilter(['**/*', '!.min.*'], { restore: true });
    var libs = gulp.src(assets.libs.src, { base: 'bower_components/' })
        .pipe(gulpif(isProduction, uglify()))
        .pipe(filterJSMin)
        .pipe(rename({ suffix: '.min' }))
        .pipe(filterJSMin.restore)
        .pipe(flatten({ includeParents: 1 }))
        .pipe(gulp.dest("build/" + assets.libs.dest));

    var filterCssMin = gulpFilter(['**/*', '!.min.*'], { restore: true });
    var css = gulp.src(assets.css.src)
        .pipe(gulpif(isProduction, minifyCss()))
        .pipe(filterCssMin)
        .pipe(rename({ suffix: '.min' }))
        .pipe(filterCssMin.restore)
        .pipe(gulp.dest("build/" + assets.css.dest));

    var fonts = gulp.src(assets.fonts.src)
        .pipe(gulp.dest("build/" + assets.fonts.dest));

    return merge(libs, css, fonts);
});
