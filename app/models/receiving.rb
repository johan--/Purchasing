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

  has_many :receiving_lines, dependent: :destroy
  belongs_to :purchase

  accepts_nested_attributes_for :receiving_lines, :reject_if => lambda { |a| a[:quantity].blank? }, :allow_destroy => true

  validates_associated :receiving_lines
  validate :require_lines

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
      # This is really ugly!  Need to figure out a better way to update Purchased.received
      self.purchase.update_received

      p = Purchase.includes({ line_items: :receiving_lines }).find(self.purchase.id)
      p.line_items.each { |item| item.update_rec_count }
    end
  end

  private

  def require_lines
    errors.add(:base, "You must have at least one item received") if receiving_lines.length < 1
  end

end
