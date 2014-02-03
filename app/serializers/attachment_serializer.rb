
class AttachmentSerializer < BaseSerializer
  embed:ids, include: true

  attributes :id, :purchase_id, :category, :attachment_file_name,
             :attachment_content_type, :attachment_file_size, :attachment_updated_at,
             :created_at, :attachment_thumb_url, :attachment_preview_url, :attachment_url

  def attachment_url
    object.url
  end

  def attachment_thumb_url
    object.url(:thumb)
  end

  def attachment_preview_url
    object.url(:preview)
  end

end
