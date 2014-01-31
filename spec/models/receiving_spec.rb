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

        @purchase = FactoryGirl.create(:purchase_with_line)
        @line = @purchase.line_items.first
        @receiving = FactoryGirl.create(:receiving_with_line, { quantity: (@line.quantity - 1),
                                                                purchase_id: @purchase.id,
                                                                line_item_id: @line.id })
        @receiving_line = @receiving.receiving_lines.first
      end
    end

    context '- One line item' do
      it '- After updating will flag parent as received' do
        expect(@purchase.received).to be_false

        @receiving_line.update(quantity: @line.quantity)
        @receiving.save

        expect(@purchase.reload.received).to be_true
      end

      it '- After updating will flag parent as un-received' do
        @receiving_line.update(quantity: @line.quantity)
        @receiving.save

        expect(@purchase.reload.received).to be_true

        @receiving_line.update(quantity: @line.quantity - 1)
        @receiving.save

        expect(@purchase.reload.received).to be_false
      end

      it '- After updating over line quantity will flag parent as received' do
        expect(@purchase.received).to be_false

        @receiving_line.update(quantity: @line.quantity + 1)
        @receiving.save

        expect(@purchase.reload.received).to be_true
      end
    end

    context '- With two line items' do
      before(:each) do
        @line2 = FactoryGirl.create(:line_item)
        @purchase.line_items << @line2
      end

      it '- With no receiving line for 2nd item' do
        @receiving.save

        expect(@purchase.reload.received).to be_false
      end

      it '- With receiving line for 2nd, but not all received' do
        recLine2 = ReceivingLine.create({ line_item_id: @line2.id, quantity: @line2.quantity - 1, receiving_id: @receiving.id })
        @receiving.save

        expect(@purchase.reload.received).to be_false
      end

      it '- Both all received' do
        recLine2 = ReceivingLine.create({ line_item_id: @line2.id, quantity: @line2.quantity, receiving_id: @receiving.id })
        @receiving_line.update(quantity: @line.quantity)
        @receiving.save

        expect(@purchase.reload.received).to be_true
      end
    end

    context '- With 2 receiving documents and 2 line items' do
      before(:each) do
        @receiving_line.update(quantity: @line.quantity)
        @line2 = FactoryGirl.create(:line_item)
        @purchase.line_items << @line2
        @receiving2 = FactoryGirl.create(:receiving_with_line, { quantity: 0,
                                                                 purchase_id: @purchase.id,
                                                                 line_item_id: @line2.id })
        @receiving_line2 = @receiving2.receiving_lines.first
      end

      it '- With one all received and one empty' do
        expect(@purchase.reload.received).to be_false

        @receiving.save
        expect(@purchase.reload.received).to be_false

        @receiving2.save
        expect(@purchase.reload.received).to be_false
      end

      it '- With both all received and one empty, saving doc1' do
        @receiving_line2.update(quantity: @line2.quantity)
        @receiving.save

        expect(@purchase.reload.received).to be_true
      end

      it '- With both all received and one empty, saving doc2' do
        @receiving_line2.update(quantity: @line2.quantity)
        @receiving2.save

        expect(@purchase.reload.received).to be_true
      end
    end

    context '- With 2 receiving documents and 1 line item' do
      before(:each) do
        @receiving2 = FactoryGirl.create(:receiving_with_line, { quantity: 1,
                                                                 purchase_id: @purchase.id,
                                                                 line_item_id: @line.id })
        @receiving_line2 = @receiving2.receiving_lines.first
      end

      it '- With all items received' do
        @receiving.save
        expect(@purchase.reload.received).to be_true
      end

      it '- With one over received' do
        @receiving_line2.update(quantity: 5)
        @receiving.save
        expect(@purchase.reload.received).to be_true
      end

      it '- With one under received, saving doc1' do
        @receiving_line.update(quantity: 0)

        @receiving.save
        expect(@purchase.reload.received).to be_false
      end

      it '- With one under received, saving doc2' do
        @receiving_line.update(quantity: 0)

        @receiving2.save
        expect(@purchase.reload.received).to be_false
      end
    end

    context '- Deleting a receiving document' do
      before(:each) do
        @receiving_line.update(quantity: @line.quantity)
      end

      it '- With one receiving document and one line item' do
        @receiving.save
        expect(@purchase.reload.received).to be_true

        @receiving.destroy
        expect(@purchase.reload.received).to be_false
      end

      it '- With one receiving document and two line items' do
        line2 = FactoryGirl.create(:line_item)
        @purchase.line_items << line2
        @receiving.receiving_lines << ReceivingLine.create({ line_item_id: line2.id,
                                                             quantity: line2.quantity,
                                                             receiving_id: @receiving.id })
        @receiving.save
        expect(@purchase.reload.received).to be_true

        @receiving.destroy
        expect(@purchase.reload.received).to be_false
      end

      it '- With two receiving documents and one line item, doc1' do
        @receiving_line.update({ quantity: @line.quantity - 1 })
        FactoryGirl.create(:receiving_with_line, { quantity: 1,
                                                   purchase_id: @purchase.id,
                                                   line_item_id: @line.id })
        @receiving.save
        expect(@purchase.reload.received).to be_true

        @receiving.destroy
        expect(@purchase.reload.received).to be_false
      end

      it '- With two receiving documents and one line item, doc2' do
        @receiving_line.update({ quantity: @line.quantity - 1 })
        receiving2 = FactoryGirl.create(:receiving_with_line, { quantity: 1,
                                                                purchase_id: @purchase.id,
                                                                line_item_id: @line.id })
        @receiving.save
        expect(@purchase.reload.received).to be_true

        receiving2.destroy
        expect(@purchase.reload.received).to be_false
      end

      it '- With two receiving documents and two line items' do
        line2 = FactoryGirl.create(:line_item)
        @purchase.line_items << line2
        receiving2 = FactoryGirl.create(:receiving_with_line, { quantity: line2.quantity,
                                                                purchase_id: @purchase.id,
                                                                line_item_id: line2.id })
        @receiving.save
        expect(@purchase.reload.received).to be_true

        @receiving.destroy
        expect(@purchase.reload.received).to be_false
      end


    end
  end
end
