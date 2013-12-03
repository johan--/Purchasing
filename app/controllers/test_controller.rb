class TestController < ApplicationController
  layout false

  before_action :authenticate_user!
  filter_access_to :all

  def index
    @tabs = Settings.app.tabs.split(' ')
  end

end
