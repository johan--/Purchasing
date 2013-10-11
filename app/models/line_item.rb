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

  belongs_to :purchase
  has_many :receiving_lines, dependent: :destroy

  before_save :update_last_user

  validates :description, :presence => { message: "Line item must have a description" }
  validates :quantity, :presence => { message: "Line item must have a quantity" }

  def update_last_user
    self.last_user = "admin" # current_user.name
  end

  def price=(price)
    super price.to_s.delete("$,")
  end

  def total
    (price.nil? || quantity.nil?) ? 0 : quantity * price
  end

end
