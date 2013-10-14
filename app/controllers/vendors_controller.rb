class VendorsController < ApplicationController

  before_action :authenticate_user!
  before_action :set_record, only: [:edit, :update, :destroy]
  filter_access_to :all
  filter_access_to :token_request, :require => :token_request, load_method: ->{ Vendor.first }

  def index
    @page = params[:page] || 1
    search = params[:search]
    letter = params[:letter]

    @vendors = Vendor.filter(search).letter(letter).sorted.page(@page).per(9)

    respond_to do |format|
      format.html { }
      format.js { }
    end
  end

  def token_request
    vendors = Vendor.token_search(params[:q])
    vendors = [Vendor.new( :id => 0, :name => "Add vendor: #{params[:q]}" )] if vendors.length == 0
    render :json => vendors, root: false
  end

  def new
    @title = "New Vendor"
    @vendor = Vendor.new

    respond_to do |format|
      format.html { render :_edit }
      format.js { render :edit  }
    end
  end

  def edit
    @title = "Edit Vendor #{@vendor.id}"

    respond_to do |format|
      format.html { render :_form }
      format.js { }
    end
  end

  def create
    respond_to do |format|
    @vendor = Vendor.new(record_params)

      if @vendor.save
        flash_notice :notice, 'Vendor was successfully created.'
        format.html { redirect_to vendors_url }
        format.js { render :_save }
      else
        flash_notice :error, @vendor.errors
        format.html { redirect_to edit_vendor_url }
        format.js { render :error }

      end

    end
  end

  def update
    respond_to do |format|
      if @vendor.update(record_params)
        flash_notice :notice, 'Vendor was successfully updated.'
        format.html { redirect_to vendors_url }
        format.js { render :_save }
      else
        flash_notice :error, @vendor.error
        format.html { redirect_to edit_vendor_url }
        format.js { render :error }
      end
    end
  end

  def destroy
    respond_to do |format|

      if @vendor.purchases.length > 0
        flash_notice :error, "Cannot delete a vendor with purchases"
        format.js { render :error }
      elsif @vendor.destroy
        flash_notice :notice, "Record #{params[:id]} deleted"
        format.js { render :destroy }
      else
        #flash_notice :error, "Error deleting record"
        flash_notice :error, @vendor.errors_with_children
        format.js { render :error }
      end

      format.html { redirect_to vendors_url }
    end
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
