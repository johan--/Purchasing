# == Schema Information
#
# Table name: receivings
#
#  id           :integer          not null, primary key
#  purchase_id  :integer
#  total        :integer
#  package_num  :string(255)
#  package_date :date
#  last_user    :string(255)
#  created_at   :datetime
#  updated_at   :datetime
#

class Receiving < ActiveRecord::Base
  using_access_control

  has_many :receiving_lines, dependent: :destroy
  belongs_to :purchase, touch: true

  accepts_nested_attributes_for :receiving_lines, :reject_if => lambda { |a| a[:quantity].blank? }, :allow_destroy => true

  validates_associated :receiving_lines
  validate :require_lines

  before_save :update_last_user
  after_destroy :update_parent_receiving

  def update_last_user
    if Authorization.current_user && Authorization.current_user.respond_to?(:name)
      self.last_user = Authorization.current_user.name
    end
  end

  def total
    self.receiving_lines.map(&:quantity).sum || 0
  end

  def update_parent_receiving
    self.purchase.try(:update_received)
  end

  def self.receive_all(purchase)
    received_items = false
    new_doc = nil

    if purchase.received
      purchase.errors.add 'Lines', 'All items have been received'
      return false
    end

    Purchase.transaction do
      new_doc = purchase.receivings.create
      purchase.line_items.each do |line|
        if line.remaining > 0
          received_items = true
          new_doc.receiving_lines << ReceivingLine.create(quantity: line.remaining, line_item_id: line.id)
        end
      end

      if received_items
        purchase.update_received
      else
        purchase.errors.add 'Lines', 'Unable to find items to receive'
        raise ActiveRecord::Rollback
      end
    end

    (received_items) ? new_doc : false
  end

  private

  def require_lines
    errors.add(:base, "You must have at least one item received") if receiving_lines.length < 1
  end

end
