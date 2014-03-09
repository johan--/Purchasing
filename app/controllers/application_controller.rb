
class ApplicationController < ActionController::Base
  before_filter :set_current_user, :check_authentication_param, :try_cas_gateway_login

  helper :all
  helper_method :current_user, :user_signed_in?

  protect_from_forgery with: :reset_session

  def current_user
    return @current_user unless @current_user.nil?

    username = session[:username] || session['cas'].try(:[], 'user')
    cas_attrs = session['cas'].try(:[], 'extra_attributes') || {}

    return nil if username.nil?

    @current_user = User.find_or_initialize_by(username: username).tap do |user|
      if !session[:username] # first time returning from CAS
        user.update_from_cas! cas_attrs unless Rails.env.test?
        user.update_login_info!

        reinitialize_session
      end

      if user.new_record?
        user = nil
      else
        session[:username] = user.username
      end
    end
  end

  impersonates :user

  private

  def reinitialize_session
    cas_data = session['cas']
    reset_session
    session['cas'] = cas_data
  end

  # Used by user_impersonate
  def sign_in(user)
    session['cas'] ||= {}
    session['cas']['user'] = user.try(:username)
    session['username'] = user.try(:username)
  end

  def set_current_user
    Authorization.current_user = current_user
  end

  def check_authentication_param
    if params[:login] == 'true' && !user_signed_in?
      render_error_page(401)
      false
    end
  end

  def try_cas_gateway_login
    unless user_signed_in? || session[:gateway_login_attempted] || Rails.env.test?
      cas_server = RackCAS::Server.new(Settings.cas.url)
      session[:gateway_login_attempted] = true
      redirect_to cas_server.login_url(request.url, gateway: true).to_s
    end
  end

  def authenticate_user!
    unless user_signed_in?
      format = response.try(:ref)

      if format && format == :json
        render json: 'You are not signed in', status: 401
      else
        render_error_page(401)
      end
    end
  end

  def user_signed_in?
    current_user.present?
  end

  # Called from declarative authorization
  def permission_denied
    if user_signed_in?
      render_error_page(404)
    else
      render('layouts/login', layout: false)
    end
  end

  def render_error_page(status)
    render file: "#{Rails.root}/public/#{status}", formats: [:html], status: status, layout: false
  end
end
