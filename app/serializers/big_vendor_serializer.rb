
class BigVendorSerializer < VendorSerializer
  attributes :num_purchases

  def num_purchases
    object.purchases.length
  end
end
