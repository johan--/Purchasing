class ReceivingSerializer < ActiveModel::Serializer
  attributes :id
  has_many :receiving_lines

  def id
    object.id.to_s
  end
end
