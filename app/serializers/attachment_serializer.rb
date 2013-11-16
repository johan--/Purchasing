class AttachmentSerializer < ActiveModel::Serializer
  attributes :id, :purchase_id, :attachment_file_name, :attachment_content_type,
             :attachment_file_size, :attachment_updated_at, :last_user
end
