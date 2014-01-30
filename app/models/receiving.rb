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
  belongs_to :purchase, touch: true

  accepts_nested_attributes_for :receiving_lines, :reject_if => lambda { |a| a[:quantity].blank? }, :allow_destroy => true

  validates_associated :receiving_lines
  validate :require_lines

  before_save :update_total_price
  before_save :update_last_user

  after_save :update_receiving_lines

  after_destroy :update_receiving_lines
  after_destroy :update_parent_receiving

  def update_last_user
    if Authorization.current_user && Authorization.current_user.respond_to?(:name)
      self.last_user = Authorization.current_user.name
    end
  end

  def update_total_price
    self.total_price = self.receiving_lines.inject(0){ |res, item| res + item.line_item.total }
  end

  def update_parent_receiving
    self.purchase.try(:update_received)
  end

  def update_receiving_lines
    self.purchase.line_items.each { |item| item.update_rec_count } if self.purchase
  end

  def self.receive_all(purchase)
    received_items = false
    new_doc = nil

    Purchase.transaction do
      new_doc = purchase.receivings.new
      purchase.line_items.each do |line|

        items_left = line.remaining

        if items_left > 0
          received_items = true
          new_line = ReceivingLine.create(quantity: items_left, line_item_id: line.id)
          new_doc.receiving_lines << new_line

          line.update_rec_count
        end

      end

      # Raise errors
      if !received_items
        purchase.errors.add 'Lines', 'Unable to find items to receive'
        raise ActiveRecord::Rollback

      elsif !new_doc.save || new_doc.errors.any?
        purchase.errors.add 'Receiving', "The receiving doc raised an error: #{new_doc.errors.full_messages}"
        raise ActiveRecord::Rollback

      elsif purchase.errors.any?
        raise ActiveRecord::Rollback

      elsif new_doc.new_record?
        purchase.errors.add 'Receiving', 'There was an error creating a receiving document'
        raise ActiveRecord::Rollback

      else
        purchase.update_received
        return new_doc

      end
    end

    false
  end

  private

  def require_lines
    errors.add(:base, "You must have at least one item received") if receiving_lines.length < 1
  end

end
