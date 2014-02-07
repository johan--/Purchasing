# == Schema Information
#
# Table name: receiving_lines
#
#  id           :integer          not null, primary key
#  line_item_id :integer
#  receiving_id :integer
#  quantity     :integer
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


  describe '- It requires a line_item' do

    it '- Save will fail with no receiving' do
      without_access_control do
        receivingLine = ReceivingLine.new
        expect(receivingLine.save).to be_false
      end
    end

    it '- Save will be success with receiving' do
      without_access_control do
        receiving = Receiving.new
        receivingLine = ReceivingLine.new(quantity: 5)
        receivingLine.receiving = receiving

        expect(receiving.save).to be_true
      end
    end
  end

end
