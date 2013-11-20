class UsersController < ApplicationController

  filter_access_to :all, no_attribute_check: :token_request,
                   additional_collection: { stop_impersonating: :index },
                   additional_member: { impersonate: :impersonate }

  def index
    page = params[:userPage] || 1
    search = params[:userSearch]

    users = User.eager.search(search).sorted.page(page).per(Settings.app.pagination.per_page * 2)
    total_pages = (1.0 * users.total_count / Settings.app.pagination.per_page * 2).ceil

    render json: users,
           meta: { total_pages: total_pages,
                   page: page,
                   userSearch: search }
  end

  # JSON lookup for requester
  def token_request
    users = User.search(params[:q])
    render :json => users, root: false
  end

    def token_request
    vendors = Vendor.token_search(params[:q])
    vendors = [Vendor.new( :id => 0, :name => "Add vendor: #{params[:q]}" )] if vendors.length == 0
    render :json => vendors, root: false
  end

  def impersonate
    if true_user.can_impersonate?
      user = User.find_by_role(params[:user_role]).sample
      impersonate_user(user)
      redirect_to root_path
    else
      redirect_to status: :not_found
    end
  end

  def stop_impersonating
    stop_impersonating_user
    redirect_to root_path
  end

end
