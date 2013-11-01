class PurchaseToTagSerializer < ActiveModel::Serializer
  attributes :id, :tag_id, :purchase_id
end
