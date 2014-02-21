
class BigAccountSerializer < AccountSerializer
  attributes :number_purchases

  def number_purchases
    object.purchases.length
  end
end
