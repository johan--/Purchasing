
module UserImpersonate
  class Engine < Rails::Engine
    config.user_class           = "User"
    config.user_finder          = "find"            # User.find
    config.user_id_column       = "id"              # Such that User.find(User.id) works
    config.user_is_staff_method = "can_impersonate?"   # current_user.can_impersonate?

    config.redirect_on_impersonate = "/"
    config.redirect_on_revert = "/"

    config.authenticate_user_method = "authenticate_user!"   # protect impersonation controller
    config.sign_in_user_method      = "sign_in"              # sign_in(user)
  end
end
