class BigPurchaseSerializer < PurchaseSerializer
  embed:ids, include: true

  attributes :tax_rate, :shipping, :labor, :account_id

  has_many :line_items
  has_many :notes
  has_many :attachments
  has_many :receivings
  has_many :accounts

end
