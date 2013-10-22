class PurchaseSerializer < ActiveModel::Serializer
  embed:ids, include: true

  attributes :id, :tracking_num, :buyer, :requester, :recipient,
             :starred, :date_requested, :date_approved, :date_requested,
             :date_purchased, :date_expected, :date_required, :date_received,
             :date_reconciled

  has_many :line_items
  has_many :tags
  has_many :vendors

  def date_requested
    format_date object.date_requested
  end

  def date_approved
    format_date object.date_approved
  end

  def date_purchased
    format_date object.date_purchased
  end

  def date_expected
    format_date object.date_expected
  end

  def date_required
    format_date object.date_required
  end

  def date_received
    format_date object.date_received
  end

  def date_reconciled
    format_date object.date_reconciled
  end

  def buyer
    [{id: object.buyer.id, name: object.buyer.name}]
  end
  def requester
    [{id: object.requester.id, name: object.requester.name}]
  end

  def recipient
    [{id: object.recipient.id, name: object.recipient.name}]
  end

  def format_date(date)
    return if date.nil?
    date.strftime("%b %-d, %Y")
  end
end
