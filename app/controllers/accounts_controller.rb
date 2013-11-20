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
    new_account = Account.new(record_params)

    if new_account.save
      render json: new_account, status: :ok
    else
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
    params.require(:account).permit(:id, :fund, :org, :acct, :user_id, :number)
  end

end
