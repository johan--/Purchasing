source 'https://rubygems.org'
ruby '1.9.3'

gem 'rails', '4.0.0'
gem 'sqlite3'

gem 'active_model_serializers', '~> 0.8.1'
gem 'coffee-rails', '~> 4.0.0'
gem 'compass-rails', '>= 2.0.alpha.0'
gem 'declarative_authorization', '~>0.5.3'
gem 'haml', '~> 4.0.3'
gem 'humanity', '~> 0.2.1'
gem 'jquery-rails', '~> 3.0.4'
gem 'jquery-ui-rails', '~> 4.0.5'
gem 'kaminari', '~>0.14.1'
gem 'memoist', '~>0.9.1'
gem 'nokogiri', '~>1.6.0'
gem 'paperclip', '~> 3.5.1'
gem 'rack-cas', '~> 0.8.1'
gem 'rails_config', '~> 0.3.3'
gem 'sass-rails', '~> 4.0.0'
#gem 'sunspot_rails', '~> 2.0.0'
gem 'thin', '~> 1.6.0'
gem 'turnout', '~> 0.2.2'
gem 'uglifier', '~> 2.2.1'
gem 'user_impersonate', path: './lib/user_impersonate'

group :development do
  gem 'annotate', '~> 2.5.0'
	gem 'better_errors', '~> 1.0.1'
	gem 'binding_of_caller', '~> 0.7.2'
end

group :test do
  gem 'factory_girl_rails', '~> 4.2.0'
  gem 'faker', '~> 1.2.0'
  gem 'simplecov', :require => false
  gem 'rails_best_practices'
  gem 'rspec-rails', '~> 2.0'
	gem 'webrat', '~> 0.7.3'
end

group :development, :test do
  #gem 'sunspot_solr', '~> 2.0.0'
  #gem 'sunspot-rails-tester', '~> 1.0.0'
end

group :production do
  gem 'pg', '~> 0.17.0'
  gem 'rails_12factor', '~> 0.0.2' # So heroku will serve assets
end


# See https://github.com/sstephenson/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Turbolinks makes following links in your web application faster. Read more: https://github.com/rails/turbolinks
# gem 'turbolinks'
