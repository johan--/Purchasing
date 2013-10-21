class ReceivingSerializer < ActiveModel::Serializer
  attributes :id
  has_many :receiving_lines
end
