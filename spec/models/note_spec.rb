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

  describe '- When creating a record it saves the current user' do
    before(:each) do
      without_access_control do
        @user = FactoryGirl.create(:admin)
        set_current_user @user, false
      end
    end

    it 'Creating a record sets last user' do
      note = FactoryGirl.create(:note)

      expect(note.user.id).to eq(@user.id)
    end

    it 'Saving a record does not change anything' do
      note = FactoryGirl.create(:note)

      without_access_control do
        set_current_user FactoryGirl.create(:buyer), false

        note.save
        expect(note.user.id).to eq(@user.id)
      end
    end
  end
end
