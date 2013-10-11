class TagsController < ApplicationController

  filter_resource_access

  # All calls are js
  def index
    @tags = Tag.all << Tag.new( id: Time.now.to_i )
  end

  def update

    @tags = Tag.update_or_create(params[:tags].keys, params[:tags].values).reject{ |tag| tag.errors.empty? }

    if @tags.empty?
      flash_notice :notice, 'Tags were successfully updated.'
      render :save
    else
      flash_notice :error, @tags.map { |tag| tag.errors.full_messages }
      render :error
    end
  end

  private

  def record_params
    params.require(:tag).permit( :name, :id )
  end
end
