
class PurchasesController < ApplicationController

  before_action :authenticate_user!
  before_action :set_record, only: [:show, :edit, :update, :destroy, :receive_all]
  filter_access_to :all

  def index
    @page = params[:page] || 1
    @sort = params[:sort] || ""
    @tab = params[:tab] || 'On-route'
    @tabs = [ 'On-route', 'Received', 'Reconciled' ]
    @flash = params[:flash] || false

    @purchases = Purchase.eager_min.tab(@tab).buyer(@buyer).sorted(@sort).page(@page)

    render json: @purchases
  end

  def show
    render json: @purchase, serializer: BigPurchaseSerializer
  end

  def create
    @purchase = Purchase.new(record_params)

    if @purchase.save
      render json: @purchase, status: :created, location: @purchase
    else
      render json: @purchase.errors, status: :unprocessable_entity
    end
  end

  def update
    if @purchase.update(record_params)
      head :no_content
    else
      render json: @purchase.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @purchase.destroy
      head :no_content
    else
      render json: @purchase.errors, status: :unprocessable_entity
    end
  end

  def update_star
    Purchase.find(params[:id]).set_starred params[:star]
    head :no_content
  end

  def receive_all
    if @purchase.receive_all
      head :no_content
    else
      render json: @purchase.errors, status: :unprocessable_entity
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
