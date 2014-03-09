
class UserSerializer < ActiveModel::Serializer

  self.root = false

  attributes :id, :name, :department, :email, :phone, :photo_url, :displayname

  # Proxy name so that token input can view both server and api results
  def displayname
    object.name
  end
end
