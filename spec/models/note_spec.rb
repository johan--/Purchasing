# == Schema Information
#
# Table name: notes
#
#  id          :integer          not null, primary key
#  text        :string(255)
#  purchase_id :integer
#  user_id     :integer
#  created_at  :datetime
#  updated_at  :datetime
#

require 'spec_helper'

describe Note do

  describe '- It updates the last user' do
    before(:each) do
      without_access_control do
        @user = FactoryGirl.create(:admin)
        set_current_user(@user, false)

        @note = FactoryGirl.create(:note)

        @user2 = FactoryGirl.create(:admin)
        set_current_user(@user2, false)
      end
    end

    it 'Saving a record updates last user' do
      @note.save
      expect(@note.last_user).to eq(@user2.name)
    end

    it 'Creating a record sets last user' do
      expect(@note.last_user).to eq(@user.name)
    end
  end

end
