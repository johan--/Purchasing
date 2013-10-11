
class PurchasesController < ApplicationController

  filter_resource_access
  before_action :set_record, only: [:edit, :update, :destroy, :receive_all]

  def index
    @buyers = User.buyers
    @buyer = params[:buyer] || ((current_user.buyer?) ? current_user.id : 0)
    @page = params[:page] || 1
    @sort = params[:sort] || ""
    @tab = params[:tab] || 'On-route'
    @tabs = [ 'On-route', 'Received', 'Reconciled' ]
    @flash = params[:flash] || false

    @purchases = Purchase.eager_min.tab(@tab).buyer(@buyer).sorted(@sort).page(@page)

    respond_to do |format|
      format.html { }
      format.js { }
    end      
  end

  def update_star
    Purchase.find(params[:id]).set_starred params[:star]
    redirect_to purchases_url 
  end

  def receive_all
    success = @purchase.receive_all
    @purchase.reload
    @title = "Edit Purchase #{@purchase.id}"

    flash_notice(:notice, 'No items to receive') if !success
    
    render :edit
  end

  def new
    @title = "New Purchase"
    @tags = Tag.list
    @purchase = Purchase.new

    respond_to do |format|
      format.html { render :_edit }
      format.js { render :edit  }
    end  
  end

  def edit
    @title = "Edit Purchase #{@purchase.id}"

    respond_to do |format|
      format.html { render :_edit }
      format.js { }
    end 
  end

  def create
    @purchase = Purchase.new(record_params)

    if @purchase.save
      flash_notice :notice, 'Purchase was successfully created.'
      render :_save
    else
      flash_notice :error, @purchase.errors_with_children
      render :error
    end
  end

  def update
    
    respond_to do |format|
      if @purchase.update(record_params)
        flash_notice :notice, 'Purchase was successfully updated.'
        format.js { render :_save }
      else
        flash_notice :error, @purchase.errors_with_children
        format.js { render :error }
      end

      format.html { redirect_to purchases_url }

    end
  end

  def destroy
    respond_to do |format|

      if @purchase.destroy
        flash_notice :notice, "Purchase #{params[:id]} deleted"
        format.js { render :destroy }
      else
        flash_notice :error, @purchase.errors_with_children
        format.js { render :error }
      end

      format.html { redirect_to purchases_url }
    end
  end

  private
    def set_record
      @id = params[:id]
      @purchase = Purchase.eager_all.find(@id)
      @tags = Tag.list
    end

    def record_params
      params.require(:purchase).permit( 
        :tracking_num, :approved_by, :date_approved, :date_requested, :date_purchased, 
        :id, :requester_id, :account_id, :vendor_tokens, :vendor_names, :requester_tokens, :recipient_tokens,
        line_items_attributes: [ :id, :_destroy, :description, :unit, :sku, :price, :quantity ],
        attachment_attributes: [ :id, :_destroy, :attachment_file_name ],
        notes_attributes: [ :id, :_destroy, :note ],
        receivings_attributes: [ :id, :_destroy, 
                                 receiving_lines_attributes: [ :id, :quantity, :line_item_id ]
                               ],
        purchase_to_tags_attributes: [ :id, :_destroy, :tag_id ]
      )
    end

end
