# == Schema Information
#
# Table name: purchase_to_tags
#
#  id          :integer          not null, primary key
#  purchase_id :integer
#  tag_id      :integer
#

class PurchaseToTag < ActiveRecord::Base
  belongs_to :purchase
  belongs_to :tag

  validates :tag_id, :uniqueness => { scope: :purchase_id }
end
