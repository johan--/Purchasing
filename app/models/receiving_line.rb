# == Schema Information
#
# Table name: receiving_lines
#
#  id           :integer          not null, primary key
#  line_item_id :integer
#  receiving_id :integer
#  last_user    :string(255)
#  quantity     :integer
#  created_at   :datetime
#  updated_at   :datetime
#

class ReceivingLine < ActiveRecord::Base

  belongs_to :line_item
  belongs_to :receiving

  before_save :update_last_user

  validates :quantity, presence: { message: "Receiving document has blank line items" }

  def update_last_user
    self.last_user = "admin" # current_user.name
  end
end
