
# Be sure to restart your server when you modify this file.
require 'rack-cas/session_store/rails/active_record'

#Purchasing::Application.config.session_store :cookie_store, key: '_purchasing_session'
Purchasing::Application.config.session_store :rack_cas_active_record_store
