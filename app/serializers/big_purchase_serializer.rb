class BigPurchaseSerializer < PurchaseSerializer
  embed:ids, include: true

  attributes :tax_rate, :shipping, :labor, :accounts, :account

  has_many :line_items
  has_many :notes
  has_many :attachments
  has_many :receivings

  def accounts
    return if object.requester.nil?
    object.requester.accounts.map{ |acct| { id: acct.id, number: acct.number }}
  end

  def account
    object.account.try(:number)
  end

end
