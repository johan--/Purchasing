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

  describe '- update_rec_count / total_receive_recalc' do
    before(:each) do
      without_access_control do
        set_current_user(FactoryGirl.create(:admin), false)
        @purchase = FactoryGirl.create(:purchase_with_line)
        @line = @purchase.line_items.first
        @receiving = FactoryGirl.create(:receiving_with_line, { quantity: (@line.quantity - 1),
                                                                purchase_id: @purchase.id,
                                                                line_item_id: @line.id })
        @receiving_line = @receiving.receiving_lines.first
      end
    end

    it '- Will count receiving lines from one receiving doc' do
      @receiving_line.update(quantity: @line.quantity)
      @line.update_rec_count

      expect(@line.total_received).to eq(@line.quantity)
    end

    it '- Will count receiving lines from two receiving docs' do
      receiving2 = FactoryGirl.create(:receiving_with_line, { quantity: 1,
                                                              purchase_id: @purchase.id,
                                                              line_item_id: @line.id })
      @line.update_rec_count

      expect(@line.total_received).to eq(@line.quantity)
    end
  end
end
