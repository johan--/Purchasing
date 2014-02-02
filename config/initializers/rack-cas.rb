
if Rails.env.test?
  require 'rack/fake_cas'
  Purchasing::Application.config.middleware.use Rack::FakeCAS
else
  require 'rack/cas'
  require 'rack-cas/session_store/active_record'

  extra_attributes = [:cn, :eduPersonNickname, :sn, :title, :department, :mail, :url, :eduPersonAffiliation, :eduPersonEntitlement]

  Purchasing::Application.config.middleware.use Rack::CAS,
    server_url: Settings.cas.url,
    session_store: RackCAS::ActiveRecordStore,
    extra_attributes_filter: extra_attributes,
    exclude_path: '/api'

end
