
class UserTokenSerializer < ActiveModel::Serializer
  self.root = false

  # Simulate a response from the user API
  attributes :netid, :displayname, :department, :email, :phone

  def netid
    object.username
  end

  def displayname
    object.name
  end
end
