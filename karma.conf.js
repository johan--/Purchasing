// Karma configuration
// Generated on Mon Jan 20 2014 19:14:20 GMT-0800 (Pacific Standard Time)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['qunit'],


    // list of files / patterns to load in the browser
    files: [
      'http://localhost:3000/qunit',
      'app/assets/javascripts/features.js',
      'app/assets/javascripts/features.js',
      'vendor/assets/components/jquery/jquery.js',
      'vendor/assets/components/jquery-ui/ui/jquery.ui.core.js',
      'vendor/assets/components/jquery-ui/ui/jquery.ui.widget.js',
      'vendor/assets/components/jquery-ui/ui/jquery.ui.mouse.js',
      'vendor/assets/components/jquery-ui/ui/jquery.ui.draggable.js',
      'vendor/assets/components/jquery-ui/ui/jquery.ui.droppable.js',

      'vendor/assets/components/bootstrap/dist/js/bootstrap.js',
      'vendor/assets/components/bootstrap-datepicker/js/bootstrap-datepicker.js',
      'vendor/assets/components/format-currency/index.js',
      'vendor/assets/components/jquery-ajax-progress/js/jquery.ajax-progress.js',
      'vendor/assets/components/jquery-maskedinput/dist/jquery.maskedinput.js',
      'vendor/assets/components/momentjs/moment.js',
      'vendor/assets/components/token-input/index.js',
      'vendor/assets/components/handlebars/handlebars.js',

      'vendor/assets/ember/development/ember.js',
      'vendor/assets/ember/development/ember-data.js',

      'app/assets/javascripts/libs/*.js',
      'app/assets/javascripts/purchasing.js',
      'app/assets/javascripts/store.js',
      'app/assets/javascripts/mixins/*.js',
      'app/assets/javascripts/models/*.js',
      'app/assets/javascripts/controllers/*.js',
      'app/assets/javascripts/views/*.js',
      'app/assets/javascripts/helpers/*.js',
      'app/assets/javascripts/router.js',
      'app/assets/javascripts/routes/*.js',
      'app/assets/javascripts/app.js',


      'test/javascripts/test_app.js',
      'test/javascripts/test_adapter.js',
      'test/javascripts/support/*.js',
      'test/javascripts/fixtures/*.js',
      'test/javascripts/integration/*.js',
      'test/javascripts/unit/*.js'
    ],

    // list of files to exclude
    exclude: [

    ],


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
    singleRun: true
  });
};
