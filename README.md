# ng-ts-jspm-boilerplate

Angular on TypeScript with JSPM and LESS boilerplate.

## Features:
- on-the-fly transpilation of TypeScript and LESS files
- JSPM bundler integration with source maps
- unit and end-to-end tests written in TypeScripts
- TypeScript linting

## Installation

1. Install [Node.js](http://nodejs.org) version >= 4.0
2. Install global dependencies:

```shell
npm install gulp protractor -g
```

3. Install dependencies:

```shell
npm install
```

4. To prepare for e2e tests:

```shell
webdriver-manager update
```

## Usage

### Livereload:
```shell
npm start
```

### On-the-fly transpiling version:

```shell
gulp serve-live
```

### Bundled version (development)

```shell
gulp serve-build
```

### Running unit tests:

On-the-fly transpiled:

```shell
gulp unit # or karma start if karma-cli is installed globally
```

With the bundle:

```shell
gulp unit-build
```

### Running end-to-end tests:

```shell
webdriver-manager start # if Selenium not yet started
gulp e2e
```

### Running coverage report generator:

```shell
gulp coverage
```

### Linting:
```shell
gulp tslint
```

## Customization

It is possible to change most of paths this boilerplate operates. To do so, create `gulp.config.js` exporting object 
with following (optional) fields:
```js
module.exports = {
    SOURCE_DIR: 'src', // main source directory
    BUILD_DIR: 'build', // destination directory
    APP_DIR: 'app', // where you application TypeScript code really is, located inside SOURCE_DIR
    STYLES_DIR: 'styles', // *.less files (also pictures and fonts)
    BUNDLED_JS: 'bundle.js', // name of compiled JS file, inside of BUILD_DIR
    BUNDLED_CSS: 'bundle.css', // name of compiled style, inside of BUILD_DIR
    MAIN_JS_FILE: 'index.ts', // your app entry point, located inside APP_DIR
    MAIN_CSS_FILE: 'main.less', // styles entry point, located inside STYLES_DIR
}
```