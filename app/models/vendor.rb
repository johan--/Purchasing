# == Schema Information
#
# Table name: vendors
#
#  id          :integer          not null, primary key
#  name        :string(255)
#  website     :string(255)
#  email       :string(255)
#  address     :string(255)
#  city        :string(255)
#  state       :string(255)
#  zip_code    :string(255)
#  country     :string(255)
#  phone       :string(255)
#  fax         :string(255)
#  comments    :string(255)
#  account_num :string(255)
#  created_at  :datetime
#  updated_at  :datetime
#

class Vendor < ActiveRecord::Base
  using_access_control

  has_many :purchases, inverse_of: :vendors, through: :purchase_to_vendors
  has_many :purchase_to_vendors, inverse_of: :vendor

  validates :name, presence: true
  validates :name, uniqueness: true
  before_destroy :check_for_purchases

  scope :eager, ->{ includes(:purchases) }
  scope :filter, ->(param){ (param.nil?) ? all : where('lower(name) LIKE ?', "%#{param.downcase}%") }
  scope :sorted, ->{ order('name ASC') }
  scope :letter, ->(let){ (let.nil? || let.downcase == 'all') ? all : where('name LIKE ?', "#{let}%") }
  scope :token_search, ->(q){ where('lower(name) LIKE ?', "%#{q.downcase}%") }

  def check_for_purchases
    if self.purchases.length > 0
      self.errors.add 'Children', "Cannot destroy '#{self.name}' because it has purchases"
      return false
    end
  end

  def website=(url)
    super url.gsub(/http:\/\//, '') unless url.nil?
  end

  def city_state_zip
    if city.nil?
      "#{}{state} #{zip_code}" unless(state.nil? && zip_code.nil?)
    else
      "#{city}, #{state} #{zip_code}" unless(city.nil? && state.nil? && zip_code.nil?)
    end
  end
end
