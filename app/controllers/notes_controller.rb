
class NotesController < ApplicationController

  before_action :authenticate_user!
  before_action :set_record, only: [:update, :destroy]
  filter_access_to :all

  def create
    @note = Note.new(record_params)

    if @note.save
      render json: @note, status: :created, location: @note
    else
      render json: @note.errors, status: :unprocessable_entity
    end
  end

  def update
    if @note.update(record_params)
      render json: @note, status: :ok
    else
      render json: @note.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @note.destroy
      render json: nil, status: :ok
    else
      render json: @note.errors, status: :unprocessable_entity
    end
  end

  private

  def set_record
    @note = Note.find(params[:id])
  end

  def record_params
    params.require(:note).permit(:id, :text, :purchase_id)
  end
end
