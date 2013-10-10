class RequestersController < ApplicationController
  
  filter_access_to :all, no_attribute_check: :token_request

  # JSON lookup for requester
  def token_request
    unless params[:q].nil?
      user = params[:q].split(' ')
      first = user[0] || ""
      last = user[1] || user[0] || ""
    end

    if user.length > 1
      @requesters = User.where("lower(first_name) like ? AND lower(last_name) like ?", "%#{first.downcase}%", "%#{last.downcase}%")
    else
      @requesters = User.where("lower(first_name) like ? OR lower(last_name) like ?", "%#{first.downcase}%", "%#{last.downcase}%")
    end

    render :json => @requesters, root: false
  end
end
