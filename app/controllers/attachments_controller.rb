
class AttachmentsController < ApplicationController

  before_action :authenticate_user!
  filter_access_to :all, no_attribute_check: :create
  before_action :set_record, only: [:destroy]

  def create
    @attachment = Purchase.find(params[:purchase_id]).attachments.new(attachment: params[:attachment])

    if @attachment.save
      render json: @attachment, status: :ok
    else
      render json: @attachment.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @attachment.destroy
      render json: nil, status: :ok
    else
      render json: @attachment.errors, status: :unprocessable_entity
    end
  end


  private

  def set_record
    @id = params[:id]
    @attachment = Attachment.find(@id)
  end

end
