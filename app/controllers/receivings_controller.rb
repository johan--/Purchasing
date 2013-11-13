class ReceivingsController < ApplicationController

  before_action :authenticate_user!
  filter_access_to :all

  def create
    @receiving = Receiving.new(record_params)

    if @receiving.save
      render json: @receiving, status: :created
    else
      render json: @receiving.errors, status: :unprocessable_entity
    end
  end

  private

  def record_params
    params.require(:receiving).permit(:id, :name, :purchase_id, :package_num, :package_date)
  end
end
