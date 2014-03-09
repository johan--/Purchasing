
class NoteSerializer < BaseSerializer

  attributes :id, :text, :created_at, :updated_at, :purchase_id, :belongs_to_me, :user_name

  def belongs_to_me
    object.user.id == scope.id
  end

  def user_name
    object.user.name
  end

end
