class LineItemSerializer < ActiveModel::Serializer
  attributes :id, :sku, :description, :unit, :quantity, :price
end
