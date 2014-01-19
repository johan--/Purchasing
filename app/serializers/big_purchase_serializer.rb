
class BigPurchaseSerializer < PurchaseSerializer
  embed:ids, include: true

  attributes :account_id, :last_user, :updated_at, :order_number, :order_confirmation

  def tax_rate
    "%#{object.tax_rate * 100}"
  end

  has_many :notes
  has_many :attachments
  has_many :accounts

end
