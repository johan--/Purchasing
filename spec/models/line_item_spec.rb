# == Schema Information
#
# Table name: line_items
#
#  id          :integer          not null, primary key
#  purchase_id :integer
#  sku         :string(255)
#  description :string(255)
#  unit        :string(255)
#  quantity    :integer
#  price       :decimal(8, 2)
#  last_user   :string(255)
#  created_at  :datetime
#  updated_at  :datetime
#

require 'spec_helper'

describe LineItem do

  # Test validates:
    # Description
    # Quantity

  # Test receiving lines are destroyed

end
