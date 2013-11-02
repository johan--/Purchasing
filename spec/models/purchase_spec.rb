# == Schema Information
#
# Table name: purchases
#
#  id              :integer          not null, primary key
#  buyer_id        :integer
#  requester_id    :integer
#  recipient_id    :integer
#  account_id      :integer
#  tracking_num    :string(255)
#  approved_by     :string(255)
#  labor           :decimal(8, 2)    default(0.0)
#  shipping        :decimal(8, 2)    default(0.0)
#  tax_rate        :decimal(8, 2)    default(0.0)
#  date_approved   :date
#  date_requested  :date
#  date_purchased  :date
#  date_expected   :date
#  date_required   :date
#  date_received   :date
#  date_reconciled :date
#  starred         :date
#  last_user       :string(255)
#  created_at      :datetime
#  updated_at      :datetime
#

require 'spec_helper'

describe Purchase do

  # Test defaults

  # Test scopes

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

  # Receve_all ?  (redundant?)

  # Set_Star ? (redundant?)

  # Test saving nested attributes
  describe 'Translates vendor names to related vendor records' do
    without_access_control do

      before(:each) do
        @purchase = FactoryGirl.create(:purchase_with_vendors)
        @vendors = @purchase.vendors.map { |vend| {name: vend.name, id: vend.id } }
      end

      it '- It can add an existing vendor' do
        newVendor = FactoryGirl.create(:vendor)
        vendor_string = (@vendors << { name: newVendor.name }).to_json
        @purchase.vendors = vendor_string

        expect(@purchase.reload.vendors.count).to eq(3)
      end

      it '- It can create a vendor record' do
        newVendorName = 'A new vendor but not Blizzard'
        vendor_string = (@vendors << { name: newVendorName }).to_json
        @purchase.vendors = vendor_string

        newVendor = Vendor.find_by(name: newVendorName)
        expect(newVendor.id).to_not be_nil
      end

      it '- Can delete a record' do
        justOneVendor = @purchase.vendors.first
        vendor_string = { name: justOneVendor.name, id: justOneVendor.id }.to_json
        @purchase.vendors = vendor_string
        expect(@purchase.reload.vendors.count).to eq(1)
      end

      it '- Can delete all vendors' do
        @purchase.vendors = ''
        expect(@purchase.reload.vendors.count).to eq(0)
      end

    end
  end
end
