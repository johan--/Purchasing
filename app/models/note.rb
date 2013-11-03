# == Schema Information
#
# Table name: notes
#
#  id          :integer          not null, primary key
#  text        :string(255)
#  last_user   :string(255)
#  purchase_id :integer
#  created_at  :datetime
#  updated_at  :datetime
#

class Note < ActiveRecord::Base

  using_access_control

  has_many :purchases, :through => :purchase_to_notes
  has_many :purchase_to_notes
  belongs_to :user

  before_save :update_last_user

  validates :text, :presence => { message: "A note cannot be blank" }

  def update_last_user
    if Authorization.current_user && Authorization.current_user.respond_to?(:name)
      self.last_user = Authorization.current_user.name
    end
  end
end
