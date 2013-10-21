class TagsController < ApplicationController

  filter_resource_access

  def index
    @tags = Tag.all << Tag.new( id: Time.now.to_i )
    render json: @tags
  end

  def update
    @tags = Tag.update_or_create(params[:tags].keys, params[:tags].values).reject{ |tag| tag.errors.empty? }

    if @tags.empty?
      render json: @tags, status: :ok
    else
      render json: @tags.errors, status: :unprocessable_entity
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
    @tag = Tag.find(@id)
  end

  def record_params
    params.require(:tag).permit( :name, :id )
  end
end
