
class UsersController < ApplicationController
  filter_access_to :all, no_attribute_check: [:tokens, :account_tokens],
                   additional_collection: { stop_impersonating: :index, account_tokens: :account_tokens },
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
                   each_serializer: BigUserSerializer,
                   userSearch: search }
  end

  # JSON lookup for requester
  def tokens
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

  def account_tokens
    user_params = params[:user]

    # Allow for index action by user
    if user_params.is_a? String
      render json: User.eager.find(user_params),
             serializer: UserWithAccountSerializer,
             status: :ok
      return
    elsif user_params.blank? || !user_params.is_a?(Hash) || user_params['netid'].blank?
      render json: nil,
             status: :unprocessable_entity
      return
    end

    # A token has been sent
    @user = User.find_or_initialize_by(username: user_params['netid'])

    if @user.update_token(user_params)
      render json: @user,
             serializer: UserWithAccountSerializer,
             status: :ok
    else
      render json: @user.errors,
             status: :unprocessable_entity
    end
  end
end
