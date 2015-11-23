'use strict';

const gulp = require('gulp');
const path = require('path');

let conf = {};
try {
    conf = require('./gulp.config.js');
} catch (e) {
    console.info('gulp.config.js not found or is invalid, continuing with default settings.');
}

const SOURCE_DIR = conf.SOURCE_DIR || 'src';
const BUILD_DIR = conf.BUILD_DIR || 'build';
const BUILD_UT_DIR = conf.BUILD_UT_DIR || 'build-ut';
const APP_DIR = conf.APP_DIR || 'app';
const STYLES_DIR = conf.STYLES_DIR || 'styles';
const BUNDLED_JS = conf.BUNDLED_JS || 'bundle.js';
const BUNDLED_CSS = conf.BUNDLED_CSS || 'bundle.css';
const SYSTEM_JS_CONFIG_FILE = 'config.js';
const MAIN_JS_FILE = conf.MAIN_JS_FILE || 'index.ts';
const MAIN_CSS_FILE = conf.MAIN_CSS_FILE || 'main.less';
const INDEX_HTML_FILE = conf.INDEX_HTML_FILE || 'index.html';
const TS_FILES = path.join(SOURCE_DIR, APP_DIR, '**/*.ts');

const JS_BUNDLE_REPLACER = '<!-- js files -->';
const CSS_BUNDLE_REPLACER = '<!-- css files -->';

const NON_DYNAMIC_ASSETS = [
    // all files from source dir
    SOURCE_DIR + '/**/*.*',

    // except for TypeScripts...
    '!**/*.ts',

    // and less...
    '!**/*.less',

    // and jspm packages contents ...
    `!${SOURCE_DIR}/jspm_packages/**/*.*`,

    // and index.html file (will be copied by other task)
    `!${SOURCE_DIR}/${INDEX_HTML_FILE}`,

    // and system.js configuration file
    `!${SOURCE_DIR}/${SYSTEM_JS_CONFIG_FILE}`
];

/**
 * Bundles source files into single, static JS file.
 * @param {string} source
 * @param {string} targetDir
 * @param {object} [config]
 * @param {string|boolean} [config.sourceMaps] - can be true, false or 'inline'
 * @param {boolean} [config.minify]
 * @param {boolean} [config.runtime] - whether it should include libs for runtime (e.g. typescript)
 * @returns {Promise}
 */
function build(source, targetDir, config) {
    const Builder = require('systemjs-builder');
    let builder = new Builder(SOURCE_DIR, path.join(SOURCE_DIR, SYSTEM_JS_CONFIG_FILE));

    return builder.buildStatic(source, path.join(targetDir, BUNDLED_JS), config);
}

/**
 * @param {object} [config] - configuration for builder
 */
function buildJS(config) {
    return build(APP_DIR + '/' + MAIN_JS_FILE, BUILD_DIR, config);
}

function buildUnitTests(dir, config) {
    return build(APP_DIR + '/**/*.spec.ts', dir, config);
}

/**
 * @param {object} [config] - configuration for builder
 * @returns {Function}
 */
function buildJsTask(config) {
    return function (cb) {
        buildJS(config)
            .then(() => {
                console.log('Build completed');
                cb();
            }, (err) => {
                console.log('Build failed');
                cb(err);
            })
    };
}

function buildLessTask(isProduction) {
    const less = require('gulp-less');
    const sourcemaps = require('gulp-sourcemaps');
    const rename = require('gulp-rename');
    const lessSettings = {};

    if (isProduction) {
        const lessPluginsCleanCSS = require('less-plugin-clean-css');

        lessSettings.plugins = [
            new lessPluginsCleanCSS({ advanced: true })
        ];
    }

    let stream = gulp
        .src(path.join(SOURCE_DIR, STYLES_DIR, MAIN_CSS_FILE));

    if (!isProduction) {
        stream = stream.pipe(sourcemaps.init())
    }

    stream = stream.pipe(less(lessSettings));

    if (!isProduction) {
        stream = stream.pipe(sourcemaps.write())
    }

    return stream
        .pipe(rename(BUNDLED_CSS))
        .pipe(gulp.dest(BUILD_DIR));
}

gulp.task('bundle-css', () => {
    return buildLessTask(false);
});

gulp.task('bundle-css-prod', () => {
    return buildLessTask(true);
});

gulp.task('bundle-js', buildJsTask({
    runtime: false,
    sourceMaps: 'inline' // for some reason Chrome cannot handle source maps generated by System.js in separate file
                         // (at least on Artur's workstation).
}));

gulp.task('bundle-js-prod', buildJsTask({
    runtime: false,
    sourceMaps: false, // set to true for debugging production
    minify: true
}));

gulp.task('bundle-unit-tests', ['clean-build-ut'], (done) => {
    buildUnitTests(BUILD_UT_DIR, {
        runtime: false,
        sourceMaps: 'inline'
    })
        .then(() => done())
        .catch((err) => done(err));
});

gulp.task('unit', (done) => {
    const KarmaServer = require('karma').Server;

    new KarmaServer({
        configFile: `${__dirname}/karma.conf.js`,
        singleRun: true
    }, done).start();
});

gulp.task('unit-build', ['bundle-unit-tests'], (done) => {
    const KarmaServer = require('karma').Server;

    new KarmaServer({
        configFile: `${__dirname}/karma.build.conf.js`,
        singleRun: true,
        preprocessors: {} // overwrite default coverage preprocessing
    }, done).start();
});

gulp.task('coverage', ['clean-build-ut'], (done) => {
    const temp = require('temp').track();
    const KarmaServer = require('karma').Server;

    let dir = temp.mkdirSync('build-ut');
    let target = `${dir}/${BUNDLED_JS}`;

    buildUnitTests(dir, {
        runtime: false,
        sourceMaps: 'inline'
    }).then(function () {
        new KarmaServer({
            configFile: __dirname + '/karma.build.conf.js',
            files: [ target ],
            preprocessors: {
                [target]: ['coverage']
            },
            singleRun: true
        }, done).start();
    }, function (err) {
        done(err);
    });
});

gulp.task('e2e', () => {
    const protractor = require('gulp-protractor').protractor;
    const ts = require('gulp-typescript');
    const gutil = require('gulp-util');
    const temp = require('temp').track();
    const dir = temp.mkdirSync('e2e-build');

    return gulp.src([
        // typings
        'src/typings/tsd.d.ts',

        // test files
        'test/**/*.ts'
    ])
        .pipe(ts({
            noImplicitAny: true
        }))
        .pipe(gulp.dest(dir))
        .pipe(protractor({
            configFile: './protractor.config.js'
        }))
        .on('error', (err) => {
            gutil.log(gutil.colors.blue('Please make sure that Selenium server is running with'), gutil.colors.blue.bold('webdriver-manager start'));
        });
});

gulp.task('tslint', () => {
    const tslint = require('gulp-tslint');

    return gulp.src(TS_FILES)
        .pipe(tslint())
        .pipe(tslint.report('prose', {
            emitError: false
        }));
});

gulp.task('watch-tslint', ['tslint'], () => {
    return gulp.watch(TS_FILES, ['tslint']);
});

function copyStaticAssets () {
    return gulp
        .src(NON_DYNAMIC_ASSETS)
        .pipe(gulp.dest(BUILD_DIR));
}

function cleanBuild (done) {
    const rimraf = require('rimraf');

    rimraf(BUILD_DIR, done);
}

function setupIndexHtml () {
    const replace = require('gulp-replace');
    const JS_BUNDLE_REGEXP = new RegExp(`${JS_BUNDLE_REPLACER}[^]+${JS_BUNDLE_REPLACER}`, 'gi');
    const CSS_BUNDLE_REGEXP = new RegExp(`${CSS_BUNDLE_REPLACER}[^]+${CSS_BUNDLE_REPLACER}`, 'gi');

    return gulp
        .src(path.join(SOURCE_DIR, INDEX_HTML_FILE))
        .pipe(replace(JS_BUNDLE_REGEXP, `<script src="${BUNDLED_JS}"></script>`))
        .pipe(replace(CSS_BUNDLE_REGEXP, `<link rel="stylesheet" href="${BUNDLED_CSS}"/>`))
        .pipe(gulp.dest(BUILD_DIR));
}

gulp.task('clean-build', cleanBuild);
gulp.task('copy-source-to-build', ['clean-build'], copyStaticAssets);

gulp.task('bundle-scripts', ['copy-source-to-build', 'bundle-css', 'bundle-js'], setupIndexHtml);
gulp.task('bundle-scripts-prod', ['copy-source-to-build', 'bundle-css-prod', 'bundle-js-prod'], setupIndexHtml);

gulp.task('clean-build-ut', (done) => {
    const rimraf = require('rimraf');

    rimraf(BUILD_UT_DIR, done);
});

// note that build and build-prod outputs result to the same dir - BUILD_DIR
gulp.task('build', ['bundle-scripts']);
gulp.task('build-prod', ['bundle-scripts-prod']);
gulp.task('eco-build', ['bundle-css', 'bundle-js'], setupIndexHtml);

// simple watcher for all files
gulp.task('watch', ['build'], () => {
    return gulp.watch(path.join(SOURCE_DIR, '/**/*.*'), ['build']);
});

// simple watcher for all files
gulp.task('eco-watch', () => {
    gulp.watch(path.join(SOURCE_DIR, '/**/*.less'), ['bundle-css']);
    gulp.watch(path.join(SOURCE_DIR, '/**/*.ts'), ['tslint', 'bundle-js']);
    gulp.watch(path.join(SOURCE_DIR, '/**/*.html'), setupIndexHtml);
    gulp.watch(NON_DYNAMIC_ASSETS, (event) => {
        if (event.type === 'deleted') {
            cleanBuild(copyStaticAssets);
        } else {
            copyStaticAssets();
        }
    });
});

function buildServeTask(port, root, type) {
    return function (done) {
        const hs = require('http-server');
        let server = hs.createServer({
            root,
            cache: -1
        });

        server.listen(port);

        console.log(`Started ${type} server on port ${port}`);

        done();
    };
}

gulp.task('lr', ['build', 'eco-watch'], () => {
    const browserSync = require('browser-sync');
    const reload = browserSync.reload;

    browserSync({
        reloadDebounce: 1000,
        server: {
            baseDir: BUILD_DIR
        }
    });

    gulp.watch(path.join(__dirname, BUILD_DIR, '/*.*'), {cwd: path.join(__dirname, BUILD_DIR)}, reload);
});

gulp.task('serve-live', ['watch-tslint'], buildServeTask(3001, path.resolve(SOURCE_DIR), 'live'));
gulp.task('serve-build', ['watch'], buildServeTask(3002, path.resolve(BUILD_DIR), 'build'));