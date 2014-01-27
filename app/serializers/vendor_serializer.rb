class VendorSerializer < ActiveModel::Serializer
  attributes :id, :name, :website, :email, :address, :city, :state, :zip_code,
             :country, :phone, :fax, :account_num, :created_at, :updated_at


  def num_purchases
    object.purchases.length
  end
end
