# == Schema Information
#
# Table name: attachments
#
#  id                      :integer          not null, primary key
#  purchase_id             :integer
#  attachment_file_name    :string(255)
#  attachment_content_type :string(255)
#  attachment_file_size    :integer
#  attachment_updated_at   :datetime
#  last_user               :string(255)
#  created_at              :datetime
#  updated_at              :datetime
#

class Attachment < ActiveRecord::Base
  using_access_control

  belongs_to :purchase

  validates :attachment, :attachment_presence => true

  has_attached_file( :attachment,
    :styles => { preview: ["500x1100>", :png], thumb: ["200x400>", :png] },
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

  def update_last_user
    self.last_user = "admin" # current_user.name
  end

  def url(type)
    attachment.url(type)
  end
end
