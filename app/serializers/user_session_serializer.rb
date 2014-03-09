
class UserSessionSerializer < ActiveModel::Serializer
  attributes :id, :username, :name, :email, :phone, :department, :roles, :photo_url

  def roles
    object.authorized_roles
  end
end
