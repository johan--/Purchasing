
class TestController < ApplicationController

  before_action :authenticate_user!
  filter_access_to :all
  layout false

  def index
    @me = current_user
  end

end
