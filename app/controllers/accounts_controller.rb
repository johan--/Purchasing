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
    account = params[:account][:number]
    accounts = account.split('-')
    user = params[:account][:user_id]

    if account.nil? || accounts.nil?
      render json: 'Account number was empty', status: :unprocessable_entity
      return
    end
    if user.nil?
      render json: 'Cannot create an account without a user', status: :unprocessable_entity
      return
    end

    new_account = Account.new(fund: accounts[0], org: accounts[1], acct: accounts[2], user_id: user)

    if new_account.save
      render json: new_account, status: :ok
    else
      puts new_account.errors.full_messages
      render json: new_account.errors, status: :unprocessable_entity
    end

  end

  def update
    if @account.update(record_params)
      render json: @account, status: :ok
    else
      render json: @account.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @account.destroy
      render json: nil, status: :ok
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
