
class PurchasesController < ApplicationController

  before_action :authenticate_user!
  before_action :set_record, only: [:show, :edit, :destroy, :update, :receive_all]

  filter_access_to :all

  def index
    page = params[:purPage] || 1
    buyer = params[:buyer] || ((current_user.buyer?) ? current_user.id : 'all')
    sort = params[:sort] || 'date'
    direction = params[:direction] || 'DESC'
    tab = params[:tab] || 'Pending'
    min = params[:filterMinDate] || 'Jan 1, 1980'
    max = params[:filterMaxDate] || Time.now.strftime("%b %-d, %Y")
    include_receiving = (params[:filterReceiving] || 2).to_i
    include_pending = (params[:filterPending] || 2).to_i
    vendor = params[:vendor] || nil

    purchases = Purchase.eager_min.
                         tab(tab).
                         dates(min, max).
                         include_receiving(include_receiving, include_pending).
                         buyer(buyer).
                         vendor(vendor).
                         sorted(sort, direction).
                         page(page).
                         per(Settings.app.pagination.per_page)

    total_pages = (1.0 * purchases.total_count / Settings.app.pagination.per_page).ceil

    render json: purchases,
           meta:  { total_pages: total_pages,
                    tab: tab,
                    page: page,
                    sort: sort,
                    direction: direction,
                    buyer: buyer,
                    tags: Tag.list,
                    taxCodes: Settings.app.tax_codes,
                    buyers: User.buyers,
                    vendor: vendor,
                    filterMinDate: min,
                    filterMaxDate: max,
                    filterReceiving: (include_receiving == 2) ? true : false,
                    filterPending: (include_pending == 2) ? true : false}
  end

  def show
    render json: @purchase,
           meta: { tags: Tag.all,
                   taxCodes: Settings.app.tax_codes },
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
    begin # Catch model authorization exceptions
      if @purchase.update(record_params)
        render json: @purchase, status: :ok, location: @purchase
      else
        render json: @purchase.errors, status: :unprocessable_entity
      end
    rescue Authorization::NotAuthorized => err
      render nothing: true, status: :unauthorized
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

  def reconcile
    value = params[:value]
    value = true if value.nil?

    errors = Purchase.reconcile(params[:ids], value)

    if errors.length > 0
      render json: errors, status: :unprocessable_entity
    else
      render json: nil, status: :ok
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
      :id, :tracking_num, :courier,
      :date_requested, :date_approved, :date_required,  :date_expected, :date_purchased,
      :date_posted, :date_reconciled, :date_cancelled, :starred,
      :tax_rate, :shipping, :labor, :account_id, :buyer, :requester, :recipient, :vendors,

      line_items_attributes: [ :id, :_destroy, :description, :unit, :sku, :price, :quantity ],
      purchase_to_tags_attributes: [ :id, :_destroy, :tag_id ],
      notes_attributes: [ :id, :_destroy, :text ],
      attachments_attributes: [ :id, :_destroy, :attachment_file_name ]
    )
  end

end
