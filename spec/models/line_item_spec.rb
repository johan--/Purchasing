# == Schema Information
#
# Table name: line_items
#
#  id             :integer          not null, primary key
#  purchase_id    :integer
#  sku            :string(255)
#  description    :string(255)
#  unit           :string(255)
#  quantity       :integer
#  total_received :integer
#  price          :decimal(8, 2)
#  last_user      :string(255)
#  created_at     :datetime
#  updated_at     :datetime
#

require 'spec_helper'

describe LineItem do

  # Test validates:
    # Description
    # Quantity

  # Test receiving lines are destroyed

  describe '- It updates the last user' do
    before(:each) do
      without_access_control do
        @user = FactoryGirl.create(:admin)
        set_current_user(@user, false)

        @line = FactoryGirl.create(:line_item)

        @user2 = FactoryGirl.create(:admin)
        set_current_user(@user2, false)
      end
    end

    it 'Saving a record updates last user' do
      @line.save
      expect(@line.last_user).to eq(@user2.name)
    end

    it 'Creating a record sets last user' do
      expect(@line.last_user).to eq(@user.name)
    end
  end

end
