
class ReceivingsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_record, only: [:update, :destroy]
  filter_access_to :all

  def create
    @receiving = Receiving.new(record_params)

    if @receiving.save
      render json: @receiving,
             status: :created
    else
      render json: @receiving.errors,
             status: :unprocessable_entity
    end
  end

  def update
    if @receiving.update(record_params)
      render json: @receiving,
             status: :ok
    else
      render json: @receiving.errors,
             status: :unprocessable_entity
    end
  end

  def destroy
    if @receiving.destroy
      render json: nil,
             status: :ok
    else
      render json: @receiving.errors,
             status: :unprocessable_entity
    end
  end

  private

  def set_record
    @receiving = Receiving.find(params[:id])
  end

  def record_params
    params.require(:receiving).permit(:id, :_destroy, :purchase_id, :package_num, :package_date,
                                      receiving_lines_attributes: [:id, :_destroy, :quantity, :line_item_id])
  end

end
