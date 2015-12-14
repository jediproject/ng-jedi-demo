var gulp = require('gulp');
var path = require('path');
var argv = require('yargs').argv;
var flatten = require('gulp-flatten');
var merge = require('merge-stream');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var minifyCss = require('gulp-minify-css');
var filter = require('gulp-filter');
var rename = require('gulp-rename');
var replaceTask = require('gulp-replace-task');
var lazypipe = require('lazypipe');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var jshint = require('gulp-jshint');
var addsrc = require('gulp-add-src');
var filelog = require('gulp-filelog');
var fs = require('fs');
var path = require('path');
var glob = require("glob");
var print = require('gulp-print');
var change = require('gulp-change');

var assets = require('./assetsfilesgulp.json');
var packageJSON = require('./package');
var jshintConfig = packageJSON.jshintConfig;

var isProduction = argv.env === 'master' || argv.env === 'mirror';
argv.env = argv.env ? argv.env : 'develop'

// gulp.task('default', ['clean', 'assets', 'setEnvironment'], function () {
//     // content
// });


gulp.task('default', function () {
    // place code for your default task here

});
gulp.task('clean', function () {
    return gulp.src('build')
        .pipe(clean());
});

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
    if (!argv.env)
        gutil.log(gutil.colors.bold.red('[ERROR:] A environment parameter like "--env=master" is needed for the setEnvironment task'));
    else {
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
    }
});

// Run App files Build / Buildmin
gulp.task('build', ['cleanBuild'], function () {
    return gulp.src(['**/*.*', '!**/*.tpl.*', '!**/env/*.json', '**/env/*-env.json'], { cwd: 'app/', base: './' })
        .pipe(gulpif(/\.js$/, jshint(jshintConfig)))
        .pipe(addsrc('**/*.*', { cwd: 'assets/', base: './' }))
        .pipe(addsrc(['favicon.ico', 'main.tpl.js']))
        .pipe(rename(function (file) { file.basename = file.basename.replace('.tpl', ''); }))
        .pipe(gulpif(/\.js$/, gulpif(isProduction, uglify())))
        .pipe(gulpif(/\.css$/, gulpif(isProduction, minifyCss())))
        .pipe(rev())
        .pipe(addsrc(['index.html', 'version.json']))
        .pipe(revReplace())
        .pipe(gulp.dest('build/'))
        .pipe(rev.manifest('version.json', { merge: true }))
        .pipe(gulpif(/version.json/, change(performChange)))
        .pipe(gulp.dest('build/'));
});

// Get modules from directories inside ./app/ folder
function getModules() {
    return fs.readdirSync('./app').filter(function (file) {
        return fs.statSync(path.join('./app', file)).isDirectory();
    });
}

// Get modules from directories inside ./app/ folder
function firstFileOrDefault(pattern) {
    var b = glob.sync(pattern)[0];
    return b;
}

function performChange(content) {
    var files = JSON.parse(content);
    var version = { version: '0.0.1', files: files };
    return JSON.stringify(version, null, 4);
}