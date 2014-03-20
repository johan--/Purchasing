## README

###Installation

- As per the norm, first install gems
`bundle install`

- Install JS dependencies:
`bower install`

- Create / migrate DB

`bundle exec rake db:create`

`bundle exec rake db:migrate`

### To seed DB with sample data:

1. First start Sunspot `rake sunspot:solr:start`
2. Then run the following to start test data generation `rake db:seed_all`

(This task will take a few minutes as it imports a large number of users, vendors, and purchases
This will also setup roles for buyers, developers, and receivers)

### To seed a developer
This will perform a find_or_initialize_by to add the :developer role to a user:
`rake db:seed_developer['john doe']`

### Required Dependencies:
- ImageMagick -- Converter for Paperclip
- Ghostscript -- Convert PDF to image (previews)
- wkHTMLtoPDF -- Convert HTML to PDF (will need to update settings.yml if location is not on path)
- Ember 1.4 or greater is required (queryParams will cause it to fail)
- NodeJS (only to build js dependencies and run cli tests)

### Running tests
- To run RSpec tests on Rails `rspec spec`
- To run qUnit tests, browse to `http://localhost:3000/qunit`

### Running qUnit tests from command line
- Make sure dependencies are installed: `bower install`
- Install karma / test dependencies: `npm install`
- Run tests: `karma start`

### Before deploy
- Disable serve_static_assets
- Revert logging level from :debug
- Remove pretender?
- Setup config files (wicked_pdf, paperclip)
- Enable Rack:SSL
- Setup Sunspot/Solr server and remove sunspot_solr gem
