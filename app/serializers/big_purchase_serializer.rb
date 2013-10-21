class BigPurchaseSerializer < PurchaseSerializer
  embed:ids, include: true

  has_many :notes
  has_many :attachments
  has_many :receivings
end
