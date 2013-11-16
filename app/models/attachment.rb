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

  has_attached_file( :attachment,
    :url => "#{ENV['RAILS_RELATIVE_URL_ROOT'] }/attachments/:class/:basename.:style.:extension",
    :path => ":rails_root/public/attachments/:class/:basename.:style.:extension"
  )

  validates :attachment, :attachment_presence => true

  def update_last_user
    self.last_user = "admin" # current_user.name
  end
end
