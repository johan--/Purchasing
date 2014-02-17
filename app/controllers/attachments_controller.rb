
class AttachmentsController < ApplicationController

  before_action :authenticate_user!
  before_action :set_record, only: [:destroy, :update]
  filter_access_to :all, no_attribute_check: :create

  def index
    render json: Attachment.where(purchase_id: nil, user_id: current_user.id)
  end

  def create
    @attachment = Attachment.new(attachment: params[:attachment],
                                 purchase_id: params[:purchase_id],
                                 category: params[:category])

    if @attachment.save
      render json: @attachment,
             status: :ok
    else
      render json: @attachment.errors,
             status: :unprocessable_entity
    end
  end

  def destroy
    if @attachment.destroy
      render json: nil,
             status: :ok
    else
      render json: @attachment.errors,
             status: :unprocessable_entity
    end
  end

  def update
    if @attachment.update(record_params)
      render json: @attachment,
             status: :ok
    else
      render json: @attachment.errors,
             status: :unprocessable_entity
    end
  end


  private

  def set_record
    @attachment = Attachment.find(params[:id])
  end

  def record_params
    params.require(:attachment).permit(:category, :purchase_id)
  end

end
