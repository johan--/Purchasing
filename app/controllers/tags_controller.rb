class TagsController < ApplicationController

  before_action :authenticate_user!
  before_action :set_record, only: [:update, :destroy]
  filter_access_to :all

  def index
    @tags = Tag.all << Tag.new(id: Time.now.to_i)
    render json: @tags
  end

  def create
    @tag = Tag.new(record_params)

    if @tag.save
      render json: @tag, status: :created, location: @tag
    else
      render json: @tag.errors, status: :unprocessable_entity
    end
  end

  def update
    if @tag.update(record_params)
      render json: @tag, status: :ok
    else
      render json: @tag.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @tag.destroy
      render json: nil, status: :ok
    else
      render json: @tag.errors, status: :unprocessable_entity
    end
  end

  private

  def set_record
    @tag = Tag.find(params[:id])
  end

  def record_params
    params.require(:tag).permit(:name, :id)
  end
end
