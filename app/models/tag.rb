# == Schema Information
#
# Table name: tags
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  created_at :datetime
#  updated_at :datetime
#

class Tag < ActiveRecord::Base
  using_access_control

  has_many :purchases, inverse_of: :tags, :through => :purchase_to_tags
  has_many :purchase_to_tags, inverse_of: :tag

  validates :name, :presence => { message: "A tag name cannot be blank" }
  validates :name, uniqueness: true

  before_destroy :check_for_purchases

  scope :eager, ->{ includes( :purchases ) }

  def check_for_purchases
    if self.purchases.length > 0
      self.errors.add '1', "Cannot destroy '#{self.name}' because it has purchases"
      return false
    end
  end

  def self.list
    self.all.map{ |res| { name: res.name, id: res.id } }
  end
end
