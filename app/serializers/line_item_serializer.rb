class LineItemSerializer < ActiveModel::Serializer
  embed:ids

  attributes :id, :sku, :description, :unit, :quantity, :price
  has_many :receiving_lines
end
