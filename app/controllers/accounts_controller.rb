class AccountsController < ApplicationController

  before_action :authenticate_user!
  before_action :set_record, only: [:show, :edit, :update, :destroy]
  filter_access_to :all, no_attribute_check: :create

  def index
    @user = User.find(params[:user])
    render json: @user.accounts
  end

  def show
    render json: @account
  end

  def create
    user = params[:user]
    account = params[:number]
    accounts = account.split('-') if account.is_a? String
    @new_account = Account.create(fund: accounts[0], org: accounts[1], acct: accounts[2], user_id: user)
    @accounts = User.find(user).accounts

    flash_notice :error, @new_account.errors.full_messages
  end

  def update
    if @account.update(record_params)
      head :no_content
    else
      render json: @account.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @account.destroy
      head :no_content
    else
      render json: @account.errors, status: :unprocessable_entity
    end
  end

  private

  def set_record
    @account = Account.find(params[:id])
  end

  def record_params
    params.require(:account).permit( :id, :fund, :org, :acct, :user_id )
  end

end
