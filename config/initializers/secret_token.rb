if Rails.env.development? || Rails.env.test?
  Purchasing::Application.config.secret_key_base = 'x' * 40
  puts 'Secret Token set to DEV mode'
else
  Purchasing::Application.config.secret_key_base = ENV['SECRET_TOKEN']
  puts 'Secret Token set from ENV'
end