# == Schema Information
#
# Table name: notes
#
#  id          :integer          not null, primary key
#  text        :string(255)
#  purchase_id :integer
#  user_id     :integer
#  created_at  :datetime
#  updated_at  :datetime
#

class Note < ActiveRecord::Base

  using_access_control

  belongs_to :purchase, inverse_of: :notes
  belongs_to :user, inverse_of: :notes

  before_create :update_last_user
  after_save :reindex_purchase

  validates :text, presence: { message: "A note cannot be blank" }

  def update_last_user
    if Authorization.current_user
      self.user = Authorization.current_user
    end
  end

  def reindex_purchase
    Sunspot.index [self.purchase]
  end
end
