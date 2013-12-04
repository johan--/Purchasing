# == Schema Information
#
# Table name: tags
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  created_at :datetime
#  updated_at :datetime
#

require 'spec_helper'

describe 'Tag' do

  # Test validates
    # Name

  # eager

  # list


  describe "- Purchases are dependent on Tag" do
    # check_for_purchases
    it "- Method update_or_create tests for purchases" do
      without_access_control do

        tag = FactoryGirl.create(:tag)
        purchase = FactoryGirl.create(:purchase)
        purchase.tags << tag

        expect(tag.check_for_purchases).to be_false
        expect(tag.errors.size).to eq(1)

      end
    end

    # Delete a tag with a purchase
    it "- Cannot delete a tag with purchases" do
      without_access_control do

        tag = FactoryGirl.create(:tag)
        purchase = FactoryGirl.create(:purchase)
        purchase.tags << tag

        tag.destroy
        expect(tag.reload.id).to_not be_nil

      end
    end
  end
end
