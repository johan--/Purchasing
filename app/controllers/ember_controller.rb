
class EmberController < ApplicationController
  before_action :authenticate_user!
  layout false

  def index
  end


  def user_session
    render json: current_user,
           serializer: UserSessionSerializer,
           root: false
  end
end
