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

// Clean Build
gulp.task('clean', function () {
    return gulp.src(['assets/libs', 'assets/css/*', 'assets/fonts', '!assets/css/app.css'])
        .pipe(clean());
})

gulp.task('default', ['assets'], function () {
    if (!argv.env)
        argv.env = "develop";
    // content
});

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