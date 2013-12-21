# == Schema Information
#
# Table name: receivings
#
#  id           :integer          not null, primary key
#  purchase_id  :integer
#  total        :integer
#  package_num  :string(255)
#  package_date :date
#  last_user    :string(255)
#  created_at   :datetime
#  updated_at   :datetime
#

require 'spec_helper'

describe Receiving do

  # Test last_user

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

end
