source 'https://rubygems.org'

gem 'rails', '4.0.4'

gem 'active_model_serializers', '~> 0.8.1'
gem 'barber', '~> 0.4.2' # Works with handlebars 1.3
gem 'chronic'
gem 'closure-compiler'
# gem 'coffee-rails', '~> 4.0.0'
gem 'compass-rails', '1.1.2'
gem 'declarative_authorization', '~>0.5.3'
gem 'ember-rails', '0.14.1'
gem 'emblem-rails'
gem 'font-awesome-rails', '4.0.3.0'
gem 'haml', '~> 4.0.3'
gem 'handlebars-source', '~> 1.3.0'  # Force 1.3 for subexpressions
gem 'humanity'
gem 'interactor-rails'
gem 'kaminari', '~>0.14.1'
gem 'mysql2', '0.3.14'
gem 'newrelic_rpm'
gem 'nokogiri', '~>1.13.6'
gem 'paperclip', '~> 3.5.2'
gem 'pretender'
gem 'rack-cas', '~> 0.8.1'
gem 'rack-ssl'
gem 'rails_config', '~> 0.3.3'
gem 'sass-rails', '~> 4.0.0'
gem 'sunspot_rails', '~> 2.0.0'
gem 'therubyracer', :platforms => :ruby
gem 'turnout', '~> 0.2.2'
gem 'version'
gem 'wicked_pdf'

# Move to dev/test on deploy
gem 'sunspot_solr'

group :development do
  gem 'thin', '~> 1.6.0'
  gem 'annotate', '~> 2.5.0'
	gem 'better_errors', '~> 1.0.1'
	gem 'binding_of_caller', '~> 0.7.2'
end

group :test do
  gem 'factory_girl_rails', '~> 4.4.0'
  gem 'simplecov', :require => false
  gem 'rspec-rails', '~> 2.14'
  gem 'rspec-core', '2.14.7'
	gem 'webrat', '~> 0.7.3'
end

group :development, :test do
  gem 'faker', '~> 1.2.0'
  gem 'sunspot-rails-tester'
  gem 'qunit-rails'
end
