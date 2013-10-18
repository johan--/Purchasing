class BigPurchaseSerializer < ActiveModel::Serializer
  attributes :id
  has_many :line_items, :notes, :attachments, :tags, :receivings, :vendors

  def id
    object.id.to_s
  end
end
