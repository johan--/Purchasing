
class AttachmentsController < ApplicationController

  before_action :authenticate_user!
  before_action :set_record, only: [:destroy]
  filter_access_to :all, no_attribute_check: :create

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
    @attachment = Attachment.find(params[:id])
  end

end
