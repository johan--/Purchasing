# == Schema Information
#
# Table name: receivings
#
#  id           :integer          not null, primary key
#  purchase_id  :integer
#  package_num  :string(255)
#  package_date :date
#  total_price  :decimal(8, 2)
#  last_user    :string(255)
#  created_at   :datetime
#  updated_at   :datetime
#

require 'spec_helper'

describe Receiving do

  describe '- It updates the last user' do
    before(:each) do
      without_access_control do
        @user = FactoryGirl.create(:admin)
        set_current_user(@user, false)

        @receiving = FactoryGirl.create(:receiving_with_line)

        @user2 = FactoryGirl.create(:admin)
        set_current_user(@user2, false)
      end
    end

    it 'Saving a record updates last user' do
      @receiving.save
      expect(@receiving.last_user).to eq(@user2.name)
    end

    it 'Creating a record sets last user' do
      expect(@receiving.last_user).to eq(@user.name)
    end
  end

  # Test receiving lines are destroyed

  describe '- It requires receiving lines' do
    it '- Save will fail with no receiving lines' do
      without_access_control do
        receiving = Receiving.new
        expect(receiving.save).to be_false
      end
    end

    it '- Save will be success with receiving lines' do
      without_access_control do
        line_item = LineItem.create({description: '123', quantity: 5})
        line = ReceivingLine.create({ quantity: 5, line_item_id: line_item.id })
        receiving = Receiving.new
        receiving.receiving_lines << line

        expect(receiving.save).to be_true
      end
    end
  end

  describe '- It updates parent purchase and line items when saving' do
    before(:each) do
      without_access_control do
        set_current_user(FactoryGirl.create(:admin), false)

        @purchase = FactoryGirl.create(:purchase_with_lines)
        @line = @purchase.line_items.first
        @receiving = FactoryGirl.create(:receiving_with_line, { quantity: @line.quantity - 1,
                                                                purchase_id: @purchase.id,
                                                                line_item_id: @line.id })
      end
    end

    it '- After updating will flag parent as received' do
      expect(@purchase.received).to be_false

      @receiving.receiving_lines.first.update_attribute(:quantity, @line.quantity)
      @receiving.save

      expect(@purchase.reload.received).to be_true
    end

    it '- After updating will flag parent as un-received' do
      @receiving.receiving_lines.first.update_attribute(:quantity, @line.quantity)
      @receiving.save

      expect(@purchase.reload.received).to be_true

      @receiving.receiving_lines.first.update_attribute(:quantity, @line.quantity - 1)
      @receiving.save

      expect(@purchase.reload.received).to be_false
    end

    it '- After deleting will update parent as un-received' do
      @receiving.receiving_lines.first.update_attribute(:quantity, @line.quantity)
      @receiving.save

      expect(@purchase.reload.received).to be_true

      @receiving.destroy

      expect(@purchase.reload.received).to be_false
    end
  end

end
