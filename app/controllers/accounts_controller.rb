class AccountsController < ApplicationController

  filter_access_to :all, no_attribute_check: :create

  # Called via AJAX
  def create
    user = params[:user]
    account = params[:account]
    accounts = account.split('-') if account.is_a? String
    @new_account = Account.create(fund: accounts[0], org: accounts[1], acct: accounts[2], user_id: user)
    @accounts = User.find(user).accounts

    flash_notice :error, @new_account.errors.full_messages
  end
  
end
