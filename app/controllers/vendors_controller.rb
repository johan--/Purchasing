class VendorsController < ApplicationController

  before_action :authenticate_user!
  before_action :set_record, only: [:show, :update, :destroy]
  filter_access_to :all
  filter_access_to :token_request, :require => :token_request, load_method: ->{ Vendor.first }

  def index
    page = params[:page] || 1
    search = params[:search]
    letter = params[:letter]

    vendors = Vendor.filter(search).letter(letter).sorted.page(page).per(Settings.app.pagination.per_page)
    total_pages = (1.0 * vendors.total_count / Settings.app.pagination.per_page).ceil

    render json: vendors,
           meta: { total_pages: total_pages,
                   page: page,
                   search: search,
                   letter: letter }
  end

  def show
    render json: @vendor, root: 'vendor'
  end

  def create
    @vendor = Vendor.new(record_params)

    if @vendor.save
       render json: @vendor, status: :created
    else
       render json: @vendor.errors, status: :unprocessable_entity
    end
  end

  def update
    if @vendor.update(record_params)
     render json: @vendor, status: :ok, location: @purchase
    else
      render json: @vendor.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @vendor.destroy
      render json: nil, status: :ok
    else
      render json: @vendor.errors, status: :unprocessable_entity
    end
  end


  def token_request
    vendors = Vendor.token_search(params[:q])
    vendors = [Vendor.new( :id => 0, :name => "Add vendor: #{params[:q]}" )] if vendors.length == 0
    render :json => vendors, root: false
  end

  private

  def set_record
    @id = params[:id]
    @vendor = Vendor.find(@id)
  end

  def record_params
    params.require(:vendor).permit( :name, :website, :email, :address, :city,
                                    :state, :zip_code, :country, :account_num,
                                    :phone, :fax, :id )
  end
end
