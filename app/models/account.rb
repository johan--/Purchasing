# == Schema Information
#
# Table name: accounts
#
#  id         :integer          not null, primary key
#  user_id    :integer
#  fund       :integer
#  org        :integer
#  acct       :integer
#  created_at :datetime
#  updated_at :datetime
#

class Account < ActiveRecord::Base

  belongs_to :user, touch: true
  has_many :purchases

  validates_presence_of :user

  validates :fund, presence: true
  validates :org, presence: true
  validates :acct, presence: true
  validates :fund, length: { is: 6 }
  validates :org, length: { is: 6 }
  validates :acct, length: { is: 5 }

  validates :acct, uniqueness: { scope: [ :org, :fund, :user_id ] }

  before_destroy :check_for_purchases

  scope :eager, ->{ includes( :purchases ) }

  def check_for_purchases
    if self.purchases.length > 0
      self.errors.add '1', "Cannot destroy '#{self.number}' because it has purchases"
      return false
    end
  end

  def number
    "#{fund}-#{org}-#{acct}"
  end

  def number=(number)
    accounts = number.split('-')
    if accounts.nil?
      self.fund = self.org = self.acct = 0
    else
      self.fund = accounts[0] || 0
      self.org = accounts[1] || 0
      self.acct = accounts[2] || 0
    end
  end

end
