
class PurchasesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_record, only: [:show, :edit, :destroy, :update,
                                    :cancel_record, :toggle_starred, :email_purchase]

  filter_access_to :all

  def index
    page = params[:purPage] || 1
    sort = params[:sort] || 'dateRequested'
    direction = params[:direction] || 'DESC'
    tab = params[:tab] || 'Purchased'
    buyer = params[:filterBuyer] || ((current_user.buyer?) ? current_user.id : 'all')
    buyer = 'all' if tab == 'New'
    purchase_type = params[:purType]
    purchase_type = 'materials' if purchase_type.blank?

    purchases = Purchase.eager_min.
                         pur_type(purchase_type).
                         tab(tab).
                         buyer(buyer).
                         sorted(sort, direction).
                         page(page).
                         per(Settings.app.pagination.per_page)

    render json: purchases,
           meta:  { per_page:  Settings.app.pagination.per_page,
                    total_count: purchases.total_count,
                    found_count: purchases.length,
                    page: page,
                    tab: tab,
                    sort: sort,
                    direction: direction
                  }
  end

  def show
    @is_pdf = request.original_url[-3..-1].downcase == 'pdf'
    @lines = @purchase.line_items.to_a
    @lines_per_page = 10
    @num_pages = (1.0 * @lines.length / @lines_per_page).ceil

    respond_to do |format|
      format.json { render json: @purchase,
                           serializer: BigPurchaseSerializer,
                           root: 'purchase' }
      format.html { render '/print_layouts/purchase.html', layout: false }
      format.pdf { render '/print_layouts/purchase.html', layout: false }
    end
  end

  def create
    @purchase = Purchase.new(record_params)

    if @purchase.save
      render json: @purchase,
             status: :created,
             location: @purchase
    else
      render json: @purchase.errors,
             status: :unprocessable_entity
    end
  end

  def update
    begin # Catch model authorization exceptions
      if @purchase.update(record_params)
        render json: @purchase,
               status: :ok,
               location: @purchase
      else
        render json: @purchase.errors,
               status: :unprocessable_entity
      end
    rescue Authorization::NotAuthorized
      render nothing: true, status: :unauthorized
    end
  end

  def destroy
    if @purchase.destroy
      render json: nil, status: :ok
    else
      render json: @purchase.errors,
             status: :unprocessable_entity
    end
  end

  def email_purchase
    cannedMessage = process_shortcuts CannedMessage.find_by(name: params[:canned_message])
    newNote = @purchase.notes.create({ text: cannedMessage.note_text }) if cannedMessage

    to = params[:to]
    name = params[:name]
    cc = params[:cc]
    message = process_shortcuts params[:message]
    subject = process_shortcuts params[:subject]
    attachment_ids = params[:attachments]
    attachments = Attachment.get_attachments_from_ids(attachment_ids) unless attachment_ids.nil?
    include_purchase = params[:include_purchase]

    if message.nil?
      render json: 'Message Text was empty',
             status: :unprocessable_entity
      return
    end

    if to.nil?
      render json: 'Message TO was empty',
             status: :unprocessable_entity
      return
    end

    begin
      PurchaseMailer.purchase_email(@purchase, to, name, cc, current_user.email, message, subject, attachments, include_purchase).deliver
    rescue Net::SMTPAuthenticationError, Net::SMTPServerBusy, Net::SMTPSyntaxError, Net::SMTPFatalError, Net::SMTPUnknownError => e
      render json: "Error sending email: #{e}",
             status: :unprocessable_entity
    end

    render json: newNote,
           status: :ok
  end

  def receive_all
    @purchase = Purchase.eager_receiving.find(params[:id])
    @receiving = @purchase.receive_all

    if @receiving
      render json: @receiving,
             status: :ok
    else
      render json: @purchase.errors,
             status: :unprocessable_entity
    end
  end

  def reconcile
    errors = Purchase.reconcile(params[:ids], params[:value])

    if errors.length > 0
      render json: errors,
             status: :unprocessable_entity
    else
      render json: nil,
             status: :ok
    end
  end

  def assign
    buyer_id = params[:user_id]
    ids = params[:ids]

    unless buyer_id.blank?
      user = User.find_by(id: buyer_id)

      if user.nil? || !user.has_role?([:buyer, :manager, :developer])
        render json: 'User is not a buyer',
               status: :unprocessable_entity
        return
      end
    end

    errors = Purchase.assign(ids, buyer_id)
    purchase = (ids.length == 1) ? Purchase.find(ids[0]) : nil

    if errors.length > 0
      render json: errors,
             status: :unprocessable_entity
    else
      render json: purchase,
             status: :ok
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
      :date_posted, :date_reconciled, :date_canceled, :starred, :order_number, :order_confirmation,
      :tax_rate, :shipping, :labor, :account_id, :buyer, :requester, :recipient, :vendors,
      :purchase_type, new_attachments: [],

      line_items_attributes: [ :id, :_destroy, :description, :unit, :sku, :price, :quantity ],
      purchase_to_tags_attributes: [ :id, :_destroy, :tag_id ]
    )
  end

  def process_shortcuts(item)
    if item && item.is_a?(String)
      item.gsub!(/%vendor/i, @purchase.vendors.first.try(:name) || '')
      item.gsub!(/%name/i, @purchase.requester.try(:first_name) || '')
      item.gsub!(/%order_num/i, @purchase.try(:order_number) || '')
      item.gsub!(/%id/i, @purchase.id.to_s)
    end

    item
  end

end
