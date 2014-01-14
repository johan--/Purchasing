
class PurchaseSerializer < ActiveModel::Serializer

  embed:ids, include: true

  attributes :id, :tracking_num, :courier, :buyer, :requester, :recipient,
             :starred, :date_approved, :date_requested,  :date_required,
             :date_expected, :date_purchased, :date_reconciled, :date_posted,
             :date_cancelled, :received, :tax_rate, :shipping, :labor

  has_many :tags
  has_many :purchase_to_tags
  has_many :vendors
  has_many :line_items
  has_many :receivings

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

  def date_reconciled
    format_date object.date_reconciled
  end

  def date_posted
    format_date object.date_posted
  end

  def buyer
    serialize_user object.buyer
  end

  def requester
    serialize_user object.requester
  end

  def recipient
    serialize_user object.recipient
  end

  def format_date(date)
    return if date.nil?
    date.strftime("%b %-d, %Y")
  end

  def serialize_user(user)
    unless user.nil?
      { id: user.id,
        name: user.name,
        nameLastFirst: user.name_last_first,
        department: user.department,
        phone: user.phone }
    end
  end
end
