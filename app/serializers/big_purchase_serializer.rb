class BigPurchaseSerializer < PurchaseSerializer
  embed:ids, include: true

  attributes :tax_rate, :shipping, :labor, :account_id, :last_user, :updated_at

  def tax_rate
    "%#{object.tax_rate * 100}"
  end

  has_many :line_items
  has_many :notes
  has_many :attachments
  has_many :receivings
  has_many :accounts

end
