
class EmberController < ApplicationController

  before_action :authenticate_user!
  layout false

  def index
    @me = current_user
  end

end
