class PurchaseSerializer < ActiveModel::Serializer
  embed:ids, include: true

  attributes :id, :tracking_num, :buyer, :requester, :recipient,
             :starred, :date_requested, :date_approved, :date_requested,
             :date_purchased, :date_expected, :date_required, :date_received,
             :date_reconciled

  has_many :line_items
  has_many :tags
  has_many :vendors
end
