class AccountSerializer < ActiveModel::Serializer
  attributes :id, :number, :user_id, :number_purchases

  def number_purchases
    object.purchases.length
  end

end
