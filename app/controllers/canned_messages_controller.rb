
class CannedMessagesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_record, only: [:update, :destroy]
  filter_access_to :all

  def index
    @messages = CannedMessage.all
    render json: @messages
  end

  def create
    @message = CannedMessage.new(record_params)

    if @message.save
      render json: @message,
             location: @message,
             status: :created
    else
      render json: @message.errors,
             status: :unprocessable_entity
    end
  end

  def update
    if @message.update(record_params)
      render json: @message,
             status: :ok
    else
      render json: @message.errors,
             status: :unprocessable_entity
    end
  end

  def destroy
    if @message.destroy
      render json: nil,
             status: :ok
    else
      render json: @message.errors,
             status: :unprocessable_entity
    end
  end

  private

  def set_record
    @message = CannedMessage.find(params[:id])
  end

  def record_params
    params.require(:canned_message).permit(:id, :name, :subject, :text, :note_text,
                                           :default_to, :default_cc )
  end
end
