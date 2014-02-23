
class AccountsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_record, only: [:show, :edit, :update, :destroy]
  filter_access_to :all, no_attribute_check: :create

  def index
    @accounts = User.find(params[:user]).accounts.eager
    render json: @accounts,
           each_seriailizer: BigAccountSerializer
  end

  def create
    new_account = Account.new(record_params)

    if new_account.save
      render json: new_account,
             seriailizer: BigAccountSerializer,
             status: :ok
    else
      render json: new_account.errors,
             status: :unprocessable_entity
    end
  end

  def update
    if @account.update(record_params)
      render json: @account,
             seriailizer: BigAccountSerializer,
             status: :ok
    else
      render json: @account.errors,
             status: :unprocessable_entity
    end
  end

  def destroy
    if @account.destroy
      render json: nil,
             status: :ok
    else
      render json: @account.errors,
             status: :unprocessable_entity
    end
  end

  private

  def set_record
    @account = Account.find(params[:id])
  end

  def record_params
    params.require(:account).permit(:id, :user_id, :number)
  end
end
