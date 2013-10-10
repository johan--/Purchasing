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
#  account_num :string(255)
#  created_at  :datetime
#  updated_at  :datetime
#

class Vendor < ActiveRecord::Base
  has_many :purchases, through: :purchase_to_vendors
  has_many :purchase_to_vendors

  validates :name, presence: true
  validates :name, uniqueness: true

  scope :eager, ->{ includes(:purchases) }
  scope :filter, ->(param){ (param.nil?) ? all : where('name LIKE ?', "%#{param}%") }
  scope :sorted, ->{ order('name ASC') }
  scope :letter, ->(let){ (let.nil? || let.downcase == 'all') ? all : where('name LIKE ?', "#{let}%") }
  scope :token_search, ->(q){ where("name like ?", "%#{q}%") }

  def website=(url)
    super url.gsub(/http:\/\//, '')
  end

  def parse_phone_num(num)
  end

end
