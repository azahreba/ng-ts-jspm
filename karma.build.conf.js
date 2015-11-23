module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],

    files: [ 'build-ut/**/*.js' ],
    exclude: [],

    reporters: ['progress', 'coverage'],

    preprocessors: {
      'build-ut/**/*.js': ['coverage']
    },

    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'teamcity', subdir: '.', file: 'teamcity.txt' }
      ]
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome']
  })
};
