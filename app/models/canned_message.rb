# == Schema Information
#
# Table name: canned_messages
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  subject    :string(255)
#  text       :string(255)
#  note_text  :string(255)
#  default_to :string(255)
#  default_cc :string(255)
#  created_at :datetime
#  updated_at :datetime
#

class CannedMessage < ActiveRecord::Base
  using_access_control

  validates :name, :presence => { message: "A message's name cannot be blank" }
  validates :name, uniqueness: true
  validates :subject, :presence => { message: "A message's subject cannot be blank" }
  validates :text, :presence => { message: "A message's text cannot be blank" }

end
