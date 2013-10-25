
class EmberController < ApplicationController

  before_action :authenticate_user!
  layout false

  def index
    @tabs = Settings.app.tabs.split(' ')
  end

end
