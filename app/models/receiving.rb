# == Schema Information
#
# Table name: receivings
#
#  id          :integer          not null, primary key
#  purchase_id :integer
#  total       :integer
#  last_user   :string(255)
#  created_at  :datetime
#  updated_at  :datetime
#

class Receiving < ActiveRecord::Base
  has_many :receiving_lines, :dependent => :destroy
  belongs_to :purchase

  accepts_nested_attributes_for :receiving_lines, :reject_if => lambda { |a| a[:quantity].blank? }, :allow_destroy => true

  validates_associated :receiving_lines

  before_save :update_last_user

  def update_last_user
    self.last_user = "admin" # current_user.name
  end

  def total
    self.receiving_lines.map(&:quantity).sum || 0
  end
end
