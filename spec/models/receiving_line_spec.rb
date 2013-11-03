# == Schema Information
#
# Table name: receiving_lines
#
#  id           :integer          not null, primary key
#  line_item_id :integer
#  receiving_id :integer
#  quantity     :integer
#  last_user    :string(255)
#  created_at   :datetime
#  updated_at   :datetime
#

require 'spec_helper'

describe ReceivingLine do

  # Test last_user

  # Test validates
    # Quantity

  # Test that when a line is destroyed, parent receiving doc is checked for children

  # Test when record is saved that the total quantity for a line item isn't exceeded
end
