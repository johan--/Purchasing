
class AttachmentsController < ApplicationController

  before_action :authenticate_user!
  filter_access_to :all, no_attribute_check: :create

  def create
    @attachment = Purchase.find(params[:purchase_id]).attachments.new(attachment: params[:file])

    if @attachment.save
      render json: @attachment, status: :ok
    else
      render json: @attachment.errors, status: :unprocessable_entity
    end
  end

  private

  def attachment_params
    params.require(:user).permit(:avatar)
  end

end
