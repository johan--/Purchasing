# == Schema Information
#
# Table name: purchase_to_tags
#
#  id          :integer          not null, primary key
#  purchase_id :integer
#  tag_id      :integer
#

class PurchaseToTag < ActiveRecord::Base
  using_access_control

  belongs_to :purchase, inverse_of: :purchase_to_tags, touch: true
  belongs_to :tag, inverse_of: :purchase_to_tags

  validates :tag_id, :uniqueness => { scope: :purchase_id }
end
