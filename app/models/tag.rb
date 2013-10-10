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
  has_many :purchases, :through => :purchase_to_tags
  has_many :purchase_to_tags

  validates :name, :presence => { message: "A tag name cannot be blank" }
  before_destroy :check_for_purchases

  scope :eager, ->{ includes( :purchases ) }

  def check_for_purchases
    if self.purchases.length > 0
      self.errors.add '1', "Cannot destroy '#{self.name}' because it has purchases"
      return false
    end
  end

  def self.list
    self.all.reduce([]) { |res, v| res << [ v.name, v.id ]; res }
  end

  def self.update_or_create(ids, params)
    tags = []
    ids.each_with_index do |id, index|
      unless params[index][:name].empty?
        tag = Tag.find_by(id: id)
        tag = Tag.create if tag.nil?

        if params[index][:delete] == 'true'
          tag.destroy
        else
          tag.update_attributes( name: params[index][:name] )
        end

        tags << tag
      end
    end
    tags
  end
end
