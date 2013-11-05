# == Schema Information
#
# Table name: line_items
#
#  id          :integer          not null, primary key
#  purchase_id :integer
#  sku         :string(255)
#  description :string(255)
#  unit        :string(255)
#  quantity    :integer
#  price       :decimal(8, 2)
#  last_user   :string(255)
#  created_at  :datetime
#  updated_at  :datetime
#

class LineItem < ActiveRecord::Base
  include ActionView::Helpers::NumberHelper

  using_access_control

  belongs_to :purchase
  has_many :receiving_lines, dependent: :destroy

  before_save :update_last_user

  validates :description, :presence => { message: "Line item must have a description" }
  validates :quantity, :presence => { message: "Line item must have a quantity" }

  def update_last_user
    if Authorization.current_user && Authorization.current_user.respond_to?(:name)
      self.last_user = Authorization.current_user.name
    end
  end

  def price=(price)
    super price.to_s.delete("$,")
  end

  def total
    (price.nil? || quantity.nil?) ? 0 : quantity * price
  end

  def total_received
    self.receiving_lines.map(&:quantity).sum || 0
  end

  def remaining
    (self.quantity || 0) - self.total_received
  end
end
