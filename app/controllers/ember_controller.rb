
class EmberController < ApplicationController

  before_action :authenticate_user!
  layout false

  def index
    @buyer = params[:buyer] || ((current_user.buyer?) ? current_user.id : 0)
    @buyers = User.buyers
  end

end
