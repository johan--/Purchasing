
class UsersController < ApplicationController
  filter_access_to :all, no_attribute_check: :token_request,
                   additional_collection: { stop_impersonating: :index },
                   additional_member: { impersonate: :impersonate }

  def index
    page = params[:userPage] || 1
    search = params[:userSearch]

    users = User.eager.search(search).sorted.page(page).per(Settings.app.pagination.per_page * 2)

    render json: users,
           meta: { per_page:  Settings.app.pagination.per_page * 2,
                   total_count: users.total_count,
                   found_count: users.length,
                   page: page,
                   userSearch: search }
  end

  # JSON lookup for requester
  def token_request
    users = User.search(params[:q])
    render :json => users,
           root: false,
           each_serializer: UserTokenSerializer
  end

  def impersonate
    user = User.find_by_role(params[:user_role])

    if true_user && true_user.can_impersonate? && !user.empty?
      impersonate_user(user.sample)
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
