
class EmberController < ApplicationController

  before_action :authenticate_user!
  layout false

  def index
    @tabs = Settings.app.tabs.split(' ')
    @buyer = params[:buyer] || ((current_user.buyer?) ? current_user.id : 0)
    @buyers = User.buyers.to_json.gsub('"',"'").gsub("'id'", 'id').gsub("'name'", 'name')
  end

end
