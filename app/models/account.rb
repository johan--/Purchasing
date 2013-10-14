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

  belongs_to :user

  validates :fund, presence: true
  validates :org, presence: true
  validates :acct, presence: true
  validates :fund, length: { is: 6 }
  validates :org, length: { is: 6 }
  validates :acct, length: { is: 5 }

  validates :acct, uniqueness: { scope: [ :org, :fund, :user_id ] }

  def number
    "#{fund}-#{org}-#{acct}"
  end
end
