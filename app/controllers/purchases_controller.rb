
class PurchasesController < ApplicationController

  before_action :authenticate_user!
  before_action :set_record, only: [:show, :edit, :destroy, :update, :receive_all,
                                    :toggle_starred, :email_purchase]

  filter_access_to :all

  def index
    page = params[:purPage] || 1
    filterBuyer = params[:filterBuyer] || ((current_user.buyer?) ? current_user.id : 'all')
    sort = params[:sort] || 'dateRequested'
    direction = params[:direction] || 'DESC'
    tab = params[:tab] || 'Pending'

    purchases = Purchase.eager_min.
                         tab(tab).
                         buyer(filterBuyer).
                         sorted(sort, direction).
                         page(page).
                         per(Settings.app.pagination.per_page)

    total_pages = (1.0 * purchases.total_count / Settings.app.pagination.per_page).ceil

    render json: purchases,
           meta:  { total_pages: total_pages,
                    tags: Tag.list,
                    taxCodes: Settings.app.tax_codes,
                    buyers: User.buyers,
                    tab: tab,
                    page: page,
                    sort: sort,
                    direction: direction
                  }
  end

  def show
    respond_to do |format|
      format.json do
        render json: @purchase,
               meta: { tags: Tag.all,
                       currentUser: current_user,
                       taxCodes: Settings.app.tax_codes },
               serializer: BigPurchaseSerializer,
               root: 'purchase'
      end
      format.html do
        @is_pdf = request.original_url[-3..-1].downcase == 'pdf'
        @lines = @purchase.line_items.to_a
        @lines_per_page = 14
        @num_pages = (1.0 * @lines.length / @lines_per_page).ceil
        render '/print_layouts/purchase.html', layout: false
      end
    end
  end

  def show_print_view
    render '../purchase_mailer/purchase_print'
  end

  def email_purchase
    to = params[:to] || @purchase.requester.try(:email)
    name = params[:name] || @purchase.requester.try(:first_name)
    cc = params[:cc]
    message = params[:message]
    subject = params[:subject] || "Biola Purchase Requisition #{@purchase.id}"
    attachment_ids = params[:attachments]
    attachments = Attachment.get_attachments_from_ids(attachment_ids) unless attachment_ids.nil?

    if message.nil?
      render json: 'Message Text was empty', status: :unprocessable_entity
      return
    end

    if to.nil?
      render json: 'Message TO was empty', status: :unprocessable_entity
      return
    end

    begin
      PurchaseMailer.purchase_email(@purchase, to, name, cc, current_user.email, message, subject, attachments).deliver
    rescue Net::SMTPAuthenticationError, Net::SMTPServerBusy, Net::SMTPSyntaxError, Net::SMTPFatalError, Net::SMTPUnknownError => e
      render json: "Error sending email: #{e}", status: :unprocessable_entity
    end

    render json: nil, status: :ok
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

  def assign
    buyer_id = params[:user_id]
    
    if !buyer_id.nil? && !buyer_id.empty?
      user = User.find_by(id: buyer_id)
    
      if user.nil? || (!user.buyer? && !user.manager? && !user.developer?) 
        render json: 'User is not a buyer', status: :unprocessable_entity
        return
      end
    end 

    errors = Purchase.assign(params[:ids], buyer_id)

    if errors.length > 0
      render json: errors, status: :unprocessable_entity
    else
      render json: nil, status: :ok
    end
  end

  def toggle_starred
    if @purchase.toggle_starred
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
      :id, :tracking_num, :courier,
      :date_requested, :date_approved, :date_required,  :date_expected, :date_purchased,
      :date_posted, :date_reconciled, :date_cancelled, :starred, :order_number, :order_confirmation,
      :tax_rate, :shipping, :labor, :account_id, :buyer, :requester, :recipient, :vendors,

      line_items_attributes: [ :id, :_destroy, :description, :unit, :sku, :price, :quantity ],
      purchase_to_tags_attributes: [ :id, :_destroy, :tag_id ],
      notes_attributes: [ :id, :_destroy, :text ],
      attachments_attributes: [ :id, :_destroy, :attachment_file_name ]
    )
  end

end
