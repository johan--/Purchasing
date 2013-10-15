class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery

  before_filter :set_current_user, :check_authentication_param, :try_cas_gateway_login
  before_action :cancel_req
  helper :all

  helper_method :current_user, :user_signed_in?, :cancel_req

  # Process form cancel
  def cancel_req
    if params[:commit].eql?('Cancel')
      respond_to do |format|
        format.html { redirect_to(purchases_url) }
        format.js { render :cancel }
      end
      return false
    end
  end

  # Build messages from flash
  def flash_notice(notice, message)
    return if message.nil? || message.empty?

    flash.now[notice] ||= []

    if message.is_a? Array
      message.each do |attr, msg|
        flash.now[notice] << ((msg.nil?) ? attr : msg)
      end
    else
      flash.now[notice] << message
    end
  end

  # Copied from Biola Apps

  # Used by user_impersonate
  def sign_in(user)
    session['cas'] ||= {}
    session['cas']['user'] = user.try(:username)
    session['username'] = user.try(:username)
  end

  # Used by user_impersonate
  def authenticate_user!
    #@user = User.new
    render('application/login', layout: false) unless user_signed_in?
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

  def current_user
    return @current_user unless @current_user.nil?
    username = session[:username] || session['cas'].try(:[], 'user')
    cas_attrs = session['cas'].try(:[], 'extra_attributes') || {}

    return nil if username.nil?

    @current_user = User.find_or_initialize_by(username: username).tap do |user|
      if !session[:username] # first time returning from CAS
        user.update_from_cas! cas_attrs unless Rails.env.test?
        user.update_login_info!
      end

      if user.new_record?
        user = nil
      else
        session[:username] = user.username
      end
    end
  end

  def user_signed_in?
    current_user.present?
  end

  # Called from declarative authorization
  def permission_denied
    if user_signed_in?
      # TODO: Need a better way to handle this that can render either html or js
      # Returning 401 causes Rack-CAS to re-query which can cause a loop
      render_error_page(404)
    else
      render('application/login', layout: false)
    end
  end

  def render_error_page(status)
    render file: "#{Rails.root}/public/#{status}", formats: [:html], status: status, layout: false
  end

end
