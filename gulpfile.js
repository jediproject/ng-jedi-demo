var gulp = require('gulp'),
    argv = require('yargs').argv,
    flatten = require('gulp-flatten'),
    assets = require('./assetsfilesgulp.json'),
    merge = require('merge-stream'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if'),
    gutil = require('gulp-util'),
    minifyCss = require('gulp-minify-css'),
    filter = require('gulp-filter'),
    rename = require('gulp-rename'),
    replaceTask = require('gulp-replace-task'),
    lazypipe = require('lazypipe'),
    rev = require('gulp-rev'),
    revReplace = require('gulp-rev-replace'),
    jshint = require('gulp-jshint');

var packageJSON = require('./package');
var jshintConfig = packageJSON.jshintConfig;

var isProduction = argv.env === 'master' || argv.env === 'mirror';


gulp.task('default', function () {
    // place code for your default task here

});
gulp.task('clean', function () {
    return gulp.src('build')
        .pipe(clean());
})

gulp.task('assets', function () {
    var libs = gulp.src(assets.libs.src, { base: 'bower_components/' })
        .pipe(flatten({ includeParents: 1 }))
        .pipe(gulpif(isProduction, uglify()))
        .pipe(gulp.dest("build/" + assets.libs.dest));

    var filterMin = gulpFilter(['*', '!.min.*'], { restore: true });
    var css = gulp.src(assets.css.src)
        .pipe(gulpif(isProduction, minifyCss()))
        .pipe(filterMin)
        .pipe(rename({ suffix: '.min' }))
        .pipe(filterMin.restore)
        .pipe(gulp.dest("build/" + assets.css.dest));

    var fonts = gulp.src(assets.fonts.src)
        .pipe(gulp.dest("build/" + assets.fonts.dest));

    return merge(libs, css, fonts);
});

gulp.task('setEnvironment', function () {
    if (!argv.env) {
        gutil.log(gutil.colors.bold.red('[ERROR:] A environment parameter like "--env=master" is needed for the setEnvironment task'));
        return;
    }
    
    // Get modules from folders inside "./app/"
    var modules = getModules();

    //Set environment for each module
    for (var i = 0; i < Object.keys(modules).length; i++) {

        // Read Environment specific Settings
        var jsonEnv = require('./app/' + modules[i] + '/env/' + modules[i] + '-env.' + argv.env + '.json');

        // Replace Settings in template
        gulp.src('app/' + modules[i] + '/env/' + modules[i] + '-env.tpl.json')
            .pipe(replaceTask({
                patterns: [{ json: jsonEnv }]
            }))
            .pipe(rename(modules[i] + '-env.json'))
            .pipe(gulp.dest('app/' + modules[i] + '/env/'));
    }
});

// Get modules from directories inside ./app/ folder
function getModules() {
    var fs = require('fs'), path = require('path');
    return fs.readdirSync('./app').filter(function (file) {
        return fs.statSync(path.join('./app', file)).isDirectory();
    });
}