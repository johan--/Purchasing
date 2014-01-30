
class BigPurchaseSerializer < PurchaseSerializer
  embed:ids, include: true

  attributes :account_id, :last_user, :updated_at, :order_number, :order_confirmation,
             :tracking_num, :courier, :recipient, :date_approved, :date_required,
             :date_expected, :date_posted, :shipping, :labor

  def tax_rate
    "%#{object.tax_rate * 100}"
  end

  has_many :notes
  has_many :attachments
  has_many :accounts
  has_many :receivings
  has_many :vendors

  has_many :line_items, serializer: BigLineItemSerializer

end


