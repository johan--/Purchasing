
class CannedMessageSerializer < BaseSerializer
  attributes :id, :name, :subject, :text, :note_text, :default_to, :default_cc,
             :created_at, :updated_at
end

