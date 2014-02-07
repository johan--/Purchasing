# == Schema Information
#
# Table name: receiving_lines
#
#  id           :integer          not null, primary key
#  line_item_id :integer
#  receiving_id :integer
#  quantity     :integer
#  created_at   :datetime
#  updated_at   :datetime
#

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
  using_access_control

  belongs_to :line_item
  belongs_to :receiving, inverse_of: :receiving_lines

  validates :quantity, presence: { message: "Receiving document has blank line items" }
  validates_presence_of :receiving
end
