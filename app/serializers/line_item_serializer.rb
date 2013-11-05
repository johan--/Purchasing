class LineItemSerializer < ActiveModel::Serializer
  embed:ids

  attributes :id, :sku, :description, :unit, :quantity, :price, :purchase_id
  has_many :receiving_lines
end
