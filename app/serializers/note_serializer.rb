
class NoteSerializer < BaseSerializer
  attributes :id, :text, :last_user, :created_at, :updated_at, :purchase_id
end
