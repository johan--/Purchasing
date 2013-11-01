class NoteSerializer < ActiveModel::Serializer
  attributes :id, :text, :last_user, :created_at, :updated_at
end
