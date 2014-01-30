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


  describe '- It requires a line_item' do

    it '- Save will fail with no line item' do
      without_access_control do
        receivingLine = ReceivingLine.new
        expect(receivingLine.save).to be_false
      end
    end

    it '- Save will be success with line_item' do
      without_access_control do
        line_item = LineItem.create({ description: '123', quantity: 5 })
        receivingLine = ReceivingLine.new({ line_item_id: line_item.id,quantity: 5 })

        expect(receivingLine.save).to be_true
      end
    end
  end

end
