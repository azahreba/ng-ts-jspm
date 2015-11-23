module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jspm', 'jasmine'],

    files: [],
    exclude: [],

    proxies: {
      '/base/jspm_packages/': '/base/src/jspm_packages/'
    },

    jspm: {
      config: 'src/config.js',
      loadFiles: [
        'src/app/test.ts',
        'src/**/*.spec.ts'
      ],
      serveFiles: [
        'src/jspm_packages/**/*.*',
        'src/app/**/*.ts',
        'src/typings/**/*.ts'
      ]
    },

    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  })
};
