# == Schema Information
#
# Table name: attachments
#
#  id                      :integer          not null, primary key
#  purchase_id             :integer
#  user_id                 :integer
#  attachment_file_name    :string(255)
#  attachment_content_type :string(255)
#  attachment_file_size    :integer
#  attachment_updated_at   :datetime
#  created_at              :datetime
#  updated_at              :datetime
#

class Attachment < ActiveRecord::Base
  using_access_control

  belongs_to :purchase, touch: true
  belongs_to :user

  before_save :update_user

  validates :attachment, :attachment_presence => true

  has_attached_file( :attachment,
    :styles => { preview: ["1100x800>", :png], thumb: ["110x145>", :png] },
    :url => "#{ENV['RAILS_RELATIVE_URL_ROOT'] }/attachments/:id.:style.:extension",
    :path => ":rails_root/public/attachments/:id.:style.:extension"
  )

  before_post_process :check_file_size

  Paperclip.interpolates :id do |attachment, style|
    attachment.instance.id
  end

  def check_file_size
    valid?
    errors[:attachment_file_size].blank?
  end

  def update_user
    return unless self.user_id.nil?
    if Authorization.current_user && Authorization.current_user.respond_to?(:id)
      self.user_id = Authorization.current_user.try(:id)
    end
  end

  def url(type = nil)
    (type.nil?) ? attachment.url : attachment.url(type)
  end

  def self.get_attachments_from_ids(ids)
    return if ids.nil? || !ids.is_a?(Array)

    ids.reduce([]){ |res, id|
      if id == 0
        # TODO get a PDF of current purchase requisition
      else
        res << Attachment.find(id).attachment_file_name
      end
      res
    }
  end
end
