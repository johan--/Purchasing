# == Schema Information
#
# Table name: receivings
#
#  id           :integer          not null, primary key
#  purchase_id  :integer
#  package_num  :string(255)
#  package_date :date
#  total_price  :decimal(8, 2)
#  last_user    :string(255)
#  created_at   :datetime
#  updated_at   :datetime
#

class Receiving < ActiveRecord::Base
  using_access_control

  has_many :receiving_lines, inverse_of: :receiving, dependent: :destroy
  belongs_to :purchase, inverse_of: :receivings

  accepts_nested_attributes_for :receiving_lines, :reject_if => lambda { |a| a[:quantity].blank? }, :allow_destroy => true

  validates_associated :receiving_lines

  before_save :update_total_price
  before_save :update_last_user

  after_save :update_parent_and_lines
  after_destroy :update_parent_and_lines

  def update_last_user
    if Authorization.current_user && Authorization.current_user.respond_to?(:name)
      self.last_user = Authorization.current_user.name
    end
  end

  # Saving dollar amount of this receiving document
  # Only enable this extra SQL if we start using this field for searches
  def update_total_price
    #self.total_price = self.receiving_lines.inject(0){ |res, item| res + item.line_item.total }
  end

  def update_parent_and_lines
    if self.purchase
      self.purchase.update_received
      self.purchase.line_items.each { |item| item.update_rec_count }
    end
  end

end
