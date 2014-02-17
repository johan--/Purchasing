
class EmberController < ApplicationController

  before_action :authenticate_user!
  layout false

  def index
  end


  def user_data
    render json: current_user,
           serializer: UserDataSerializer,
           root: false
  end

end
