// Karma configuration
// Generated on Mon Jan 20 2014 19:14:20 GMT-0800 (Pacific Standard Time)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: 'app/assets/javascripts',


    // frameworks to use
    frameworks: ['qunit'],


    // list of files / patterns to load in the browser
    files: [
      { pattern: '../../../test/javascripts/karma_init.js', watched: false },

      { pattern: 'features.js', watched: false },
      { pattern: '../../../vendor/assets/components/jquery/jquery.js', watched: false },
      { pattern: '../../../vendor/assets/components/jquery-ui/ui/jquery.ui.effect.js', watched: false },

      { pattern: '../../../vendor/assets/components/bootstrap/dist/js/bootstrap.js', watched: false },
      { pattern: '../../../vendor/assets/components/bootstrap-datepicker/js/bootstrap-datepicker.js', watched: false },
      { pattern: '../../../vendor/assets/components/format-currency/index.js', watched: false },
      { pattern: '../../../vendor/assets/components/jquery-ajax-progress/js/jquery.ajax-progress.js', watched: false },
      { pattern: '../../../vendor/assets/components/jquery-maskedinput/dist/jquery.maskedinput.js', watched: false },
      { pattern: '../../../vendor/assets/components/momentjs/moment.js', watched: false },
      { pattern: '../../../vendor/assets/components/token-input/index.js', watched: false },
      { pattern: '../../../vendor/assets/components/jquery-rotate/jquery.rotate.js', watched: false },

      { pattern: '../../../vendor/assets/components/handlebars/handlebars.js', watched: false },
      { pattern: '../../../vendor/assets/ember/development/ember.js', watched: false },
      { pattern: '../../../vendor/assets/ember/development/ember-data.js', watched: false },

      { pattern: 'app.js' },
      { pattern: 'store.js' },
      { pattern: 'adapter.js' },
      { pattern: 'serializer.js' },

      { pattern: 'mixins/**/*.js' },
      { pattern: 'models/**/*.js' },
      { pattern: 'controllers/**/*.js' },
      { pattern: 'views/**/*.js' },
      { pattern: 'templates/**/*.emblem' },
      { pattern: 'components/**/*.js' },

      { pattern: 'helpers/**/*.js' },
      { pattern: 'router.js' },
      { pattern: 'routes/**/*.js' },
      { pattern: 'init/**/*.js' },

      { pattern: '../../../test/javascripts/test_app.js' },
      { pattern: '../../../test/javascripts/globals_test.js' },
      { pattern: '../../../test/javascripts/support/**/*.js' },
      { pattern: '../../../test/javascripts/test_adapter.js' },
      { pattern: '../../../test/javascripts/fixtures/**/*.js' },

      //{ pattern: '../../../test/javascripts/integration/**/*.js' },
      //{ pattern: '../../../test/javascripts/unit/**/*.js' }
      { pattern: '../../../test/javascripts/unit/routes/purchases_tabs.js' }
    ],

    // list of files to exclude
    exclude: [
    ],


    karmaEmblemPreprocessor: {
      paths: {
        jquery: 'vendor/assets/components/jquery/jquery.js',
        handlebars: 'vendor/assets/components/handlebars/handlebars.js',
        ember: 'vendor/assets/ember/development/ember.js',
        emblem: 'vendor/assets/components/emblem.js/emblem.js'
      }
    },

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],



    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    hostname: ['localhost'],
    port: 3001,

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,

    plugins: [
      'karma-qunit',
      'karma-chrome-launcher',
      'karma-emblem-preprocessor',
      'karma-phantomjs-launcher'
    ],

    preprocessors: {
      "**/*.emblem": 'emblem'
    }
  });
};
