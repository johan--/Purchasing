class UsersController < ApplicationController

  filter_access_to :all, no_attribute_check: :token_request,
                   additional_collection: { stop_impersonating: :index },
                   additional_member: { impersonate: :impersonate }
  before_action :set_record, only: [:impersonate]

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

  def impersonate
    if true_user.can_impersonate?
      impersonate_user(@user)
      redirect_to root_path
    else
      redirect_to status: :not_found
    end
  end

  def stop_impersonating
    stop_impersonating_user
    redirect_to root_path
  end

  private

  def set_record
    @user = User.find(params[:id])
  end

end
