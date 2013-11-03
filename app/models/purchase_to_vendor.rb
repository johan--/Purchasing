# == Schema Information
#
# Table name: purchase_to_vendors
#
#  id          :integer          not null, primary key
#  purchase_id :integer
#  vendor_id   :integer
#

class PurchaseToVendor < ActiveRecord::Base
  using_access_control

  belongs_to :vendor
  belongs_to :purchase
end
