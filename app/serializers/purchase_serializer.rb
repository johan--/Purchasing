
class PurchaseSerializer < BaseSerializer

  embed:ids, include: true

  attributes :id,  :buyer, :requester, :starred, :date_requested, :tax_rate,
             :date_purchased, :date_reconciled, :date_cancelled, :received_server,
             :vendor_string

  has_many :tags
  has_many :receivings
  has_many :purchase_to_tags
  has_many :line_items

  def received_server
    object.received
  end

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
    date.strftime(Settings.app.dateString)
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
