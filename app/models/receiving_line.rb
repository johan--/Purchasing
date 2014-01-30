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
  belongs_to :receiving, touch: true

  before_save :update_last_user

  before_save :add_to_parent_line
  before_destroy :remove_from_parent_line

  validates :quantity, presence: { message: "Receiving document has blank line items" }
  validates_presence_of :line_item

  def update_last_user
    if Authorization.current_user && Authorization.current_user.respond_to?(:name)
      self.last_user = Authorization.current_user.name
    end
  end

  def add_to_parent_line
    increment_parent_line self.quantity
  end

  def remove_from_parent_line
    increment_parent_line(self.quantity * -1)
  end

  # TODO: On destroy check if parent receiving document has any children (if this is destroyed from a line item)

  private

  def increment_parent_line(amt)
    line = self.line_item
    return if !line

    cur = self.line_item.total_received
    self.line_item.update_attribute(:total_received, cur + amt)
  end

end
