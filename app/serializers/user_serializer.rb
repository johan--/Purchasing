class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :department, :phone
end
