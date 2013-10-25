# == Schema Information
#
# Table name: purchases
#
#  id              :integer          not null, primary key
#  buyer_id        :integer
#  requester_id    :integer
#  recipient_id    :integer
#  account_id      :integer
#  tracking_num    :string(255)
#  approved_by     :string(255)
#  labor           :decimal(8, 2)    default(0.0)
#  shipping        :decimal(8, 2)    default(0.0)
#  tax_rate        :decimal(8, 2)    default(0.0)
#  date_approved   :date
#  date_requested  :date
#  date_purchased  :date
#  date_expected   :date
#  date_required   :date
#  date_received   :date
#  date_reconciled :date
#  starred         :date
#  last_user       :string(255)
#  created_at      :datetime
#  updated_at      :datetime
#

require 'spec_helper'

describe Purchase do

  # Test defaults

  # Test scopes

  # Test last_user

  # Test that line items are destroyed
  # Test that attachments are destroyed
  # Test that through tables are destroyed
    # Purchase_to_tag
    # Purchase_to_vendor

  # Test set_request_date

  # Test lookups:
    # vendor_tokens
    # vendor_list
    # requester_tokens
    # recipient_tokens

  # Receve_all ?  (redundant?)

  # Set_Star ? (redundant?)
end
