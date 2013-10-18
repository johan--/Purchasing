class PurchaseSerializer < ActiveModel::Serializer
  attributes :id, :vendors, :vendor_string, :requester, :recipient, :department, :buyer, :starred,
             :date_requested, :date_approved, :date_requested, :date_purchased, :date_expected, :date_required, :date_received, :date_reconciled

  has_many :line_items, :tags, :vendors

  def vendor_string
    object.vendors_list.join(', ')
  end

  def requester
    object.requester.try(:name)
  end

  def recipient
    object.recipient.try(:name)
  end

  def department
    object.requester.try(:department)
  end

  def buyer
    object.buyer.try(:name)
  end

end
