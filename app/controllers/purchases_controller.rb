
class PurchasesController < ApplicationController

  before_action :authenticate_user!
  before_action :set_record, only: [:show, :edit, :destroy, :update, :receive_all]
  filter_access_to :all

  def index
    page = params[:page] || 1
    buyer = params[:buyer] || ((current_user.buyer?) ? current_user.id : 'all')
    buyers = serializeJSON(User.buyers.to_json)
    sort = params[:sort] || 'date'
    direction = params[:direction] || 'DESC'
    tab = params[:tab] || 'Pending'
    purchases = Purchase.eager_min.tab(tab).buyer(buyer).sorted(sort, direction).page(page).per(Settings.app.pagination.per_page)

    total_pages = (1.0 * purchases.total_count / Settings.app.pagination.per_page).ceil
    render json: purchases,
           meta:  { total_pages: total_pages,
                    page: page,
                    tab: tab,
                    sort: sort,
                    direction: direction,
                    buyer: buyer,
                    buyers: buyers }

  end

  def show
    render json: @purchase,
           meta: { tags: serializeJSON(Tag.all.to_json) },
           serializer: BigPurchaseSerializer,
           root: 'purchase'
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
      render json: @purchase, status: :ok, location: @purchase
    else
      render json: @purchase.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @purchase.destroy
      render json: nil, status: :ok
    else
      render json: @purchase.errors, status: :unprocessable_entity
    end
  end

  def receive_all
    if @purchase.receive_all
      render json: nil, status: :ok
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
      :id, :requester_id, :account_id, :vendor_tokens, :vendor_names, :buyer,
      :requester, :recipient, :starred, :date_expected, :date_required,
      line_items_attributes: [ :id, :_destroy, :description, :unit, :sku, :price, :quantity ],
      attachment_attributes: [ :id, :_destroy, :attachment_file_name ],
      notes_attributes: [ :id, :_destroy, :note ],
      receivings_attributes: [ :id, :_destroy,
                               receiving_lines_attributes: [ :id, :quantity, :line_item_id ]
                             ],
      purchase_to_tags_attributes: [ :id, :_destroy, :tag_id ]
    )
  end

  def serializeJSON(json)
    return json.gsub('"',"'").gsub("'id'", 'id').gsub("'name'", 'name')
  end
end
