class TagsController < ApplicationController

  before_action :authenticate_user!
  before_action :set_record, only: [:destroy]
  filter_access_to :all

  def index
    @tags = Tag.all << Tag.new( id: Time.now.to_i )
    render json: @tags
  end

  def update
    @tag_errors = Tag.update_or_create(params[:tags].keys, params[:tags].values).reject{ |tag| tag.errors.empty? }

    if @tag_errors.empty?
      render json: @tag_errors, status: :ok
    else
      render json: @tag_errors.map{ |t| t.errors }, status: :unprocessable_entity
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
    params.require(:tag).permit( :name, :id )
  end
end
