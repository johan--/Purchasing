class ReceivingLineSerializer < ActiveModel::Serializer

  attributes :id, :quantity, :last_user, :created_at, :updated_at

end