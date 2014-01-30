# == Schema Information
#
# Table name: purchases
#
#  id                 :integer          not null, primary key
#  buyer_id           :integer
#  requester_id       :integer
#  recipient_id       :integer
#  account_id         :integer
#  tracking_num       :string(255)
#  courier            :string(255)
#  approved_by        :string(255)
#  order_number       :string(255)
#  order_confirmation :string(255)
#  vendor_string      :string(255)
#  labor              :decimal(8, 2)    default(0.0)
#  shipping           :decimal(8, 2)    default(0.0)
#  tax_rate           :decimal(8, 4)    default(0.1)
#  date_approved      :date
#  date_requested     :date
#  date_required      :date
#  date_expected      :date
#  date_purchased     :date
#  date_reconciled    :date
#  date_posted        :date
#  date_cancelled     :date
#  starred            :date
#  received           :boolean          default(FALSE)
#  last_user          :string(255)
#  created_at         :datetime
#  updated_at         :datetime
#

require 'spec_helper'

describe Purchase do

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


  # Test eager loading
  describe 'Eager loads relationships' do
    before(:each) do
      without_access_control do
        @purchase = FactoryGirl.create(:purchase_with_everything)
      end
    end

    it '-Eager loads everything' do
      #ActiveRecord::Base.logger = Logger.new(STDOUT) if defined?(ActiveRecord::Base)
      without_access_control do
        SqlCounter.start_count
          p = Purchase.eager_all.find(@purchase.id)
        SqlCounter.stop_count

        expect(SqlCounter.count).to be <=18  # Sometimes this fails with 20, but it shouldn't need to be more than 18
      end
    end

    it '-Eager loads min for list' do
      #ActiveRecord::Base.logger = Logger.new(STDOUT) if defined?(ActiveRecord::Base)
      without_access_control do
        SqlCounter.start_count
          p = Purchase.eager_min.take
        SqlCounter.stop_count

        expect(SqlCounter.count).to be <=12
      end
    end
  end

  # Receve_all
  describe 'Can receive all remaining items' do
    before(:each) do
      without_access_control do
        @purchase = FactoryGirl.create(:purchase_with_lines)
      end
    end

    it '- Receive all items flags PO as received' do
      without_access_control do
        total_items = @purchase.line_items.map(&:quantity).sum

        Receiving.receive_all @purchase
        @purchase.reload

        expect(@purchase.receivings.length).to eq(1)
        expect(@purchase.receivings.first.total).to eq(total_items)
        expect(@purchase.received).to be_true
      end
    end

    it '- Deleting the receiving doc removes flag from PO' do
      without_access_control do
        Receiving.receive_all @purchase
        @purchase.receivings.first.destroy
        @purchase.reload

        expect(@purchase.received).to be_false
        expect(@purchase.receivings.count).to eq(0)
      end
    end

    it '- When saving a requisition, purchase will update accordingly' do
      without_access_control do
        # First
        line = @purchase.line_items.first
        @purchase.receivings << FactoryGirl.create(:receiving_with_line, { quantity: line.quantity, line_item_id: line.id })
        @purchase.save
        expect(@purchase.reload.received).to be_false

        # Second
        line = @purchase.line_items.last
        @purchase.receivings << FactoryGirl.create(:receiving_with_line, { quantity: line.quantity, line_item_id: line.id })
        @purchase.save
        expect(@purchase.reload.received).to be_true
      end
    end

    it '- Will fail if no line items exist' do
      without_access_control do
        purchase = FactoryGirl.create(:purchase)
        expect(Receiving.receive_all(purchase)).to be_false
      end
    end

    it '- Will fail if everything is already received' do
      without_access_control do
        Receiving.receive_all @purchase
        expect(Receiving.receive_all @purchase).to be_false
      end
    end
  end

  # Test that received flag is true
  describe '- Receive flag' do
    before(:each) do
      without_access_control do
        @purchase = FactoryGirl.create(:purchase_with_lines)
      end
    end

    it '- Returns false if no line items exist' do
      without_access_control do
        purchase = FactoryGirl.create(:purchase)
        expect(purchase.received).to be_false
      end
    end

    it '- Returns false if line items exist but no receiving documents' do
      without_access_control do
        expect(@purchase.received).to be_false
      end
    end

    it '- Returns false if line items exist and only some receiving documents exist' do
      without_access_control do
        line = @purchase.line_items.first
        @purchase.receivings << FactoryGirl.create(:receiving_with_line, { quantity: line.quantity, line_item_id: line.id })
        @purchase.save
        expect(@purchase.reload.received).to be_false
      end
    end

    it '- Returns true if line items exist and all have been received' do
      without_access_control do
        Receiving.receive_all @purchase
        expect(@purchase.reload.received).to be_true
      end
    end

  end

  # Test saving nested attributes: vendor
  describe '- Translates vendor names to related vendor records' do

    before(:each) do
      without_access_control do
        @purchase = FactoryGirl.create(:purchase_with_vendors)
        @vendors = @purchase.vendors.map { |vend| {name: vend.name, id: vend.id } }
      end
    end

    it '- It can add an existing vendor' do
      without_access_control do
        newVendor = FactoryGirl.create(:vendor)
        vendor_string = (@vendors << { name: newVendor.name }).to_json
        @purchase.vendors = vendor_string
      end

      expect(@purchase.reload.vendors.count).to eq(3)
    end

    it '- It can create a vendor record' do
      without_access_control do
        newVendorName = 'A new vendor but not Blizzard'
        vendor_string = (@vendors << { name: newVendorName }).to_json
        @purchase.vendors = vendor_string
        @newVendor = Vendor.find_by(name: newVendorName)
      end

      expect(@newVendor.id).to_not be_nil
    end

    it '- Can delete a record' do
      without_access_control do
        justOneVendor = @purchase.vendors.first
        vendor_string = { name: justOneVendor.name, id: justOneVendor.id }.to_json
        @purchase.vendors = vendor_string
      end

      expect(@purchase.reload.vendors.count).to eq(1)
    end

    it '- Can delete all vendors' do
      without_access_control do
        @purchase.vendors = ''
      end

      expect(@purchase.reload.vendors.count).to eq(0)
    end

  end


  describe '- It reconciles an array of IDs' do

    before(:each) do
      without_access_control do
        @purchase = FactoryGirl.create(:purchase)
      end
    end

    it '- Can reconcile one record from self context' do
      without_access_control do
        @purchase.reconcile
        expect(@purchase.reload.date_reconciled).to_not be_nil
        @purchase.reconcile(false)
        expect(@purchase.reload.date_reconciled).to be_nil
      end
    end

    it '- Can reconcile many records from model context' do
      without_access_control do
        @purchase.reconcile
        purchase2 = FactoryGirl.create(:purchase)
        purchase2.reconcile

        Purchase.reconcile([@purchase.id, purchase2.id])
        expect(@purchase.reload.date_reconciled).to_not be_nil
        expect(purchase2.reload.date_reconciled).to_not be_nil

        Purchase.reconcile([@purchase.id, purchase2.id], false)
        expect(@purchase.reload.date_reconciled).to be_nil
        expect(purchase2.reload.date_reconciled).to be_nil

      end
    end

    it '- Cannot reconcile cancelled orders' do
      without_access_control do
        @purchase.update_columns(date_cancelled: Time.now)
        @purchase.reconcile
        expect(@purchase.reload.date_reconciled).to be_nil
      end
    end
  end

  describe '- Returns a list of attachments' do
    before(:each) do
      without_access_control do
        @user = FactoryGirl.create(:admin)
        set_current_user(@user, false)

        @attachment = FactoryGirl.create(:attachment_with_purchase)
        @purchase = @attachment.purchase
      end
    end

    it '- Will return attachments for a Purchase' do
      expect(@purchase.attachmentsPlusUnassigned.length).to eq(1)
    end

    it '- Will return attachments for the user with no purchase' do
      new_attachment = FactoryGirl.create(:attachment)
      expect(@purchase.attachmentsPlusUnassigned.length).to eq(2)
    end
  end
end
