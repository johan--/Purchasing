# == Schema Information
#
# Table name: attachments
#
#  id                      :integer          not null, primary key
#  purchase_id             :integer
#  user_id                 :integer
#  attachment_file_name    :string(255)
#  attachment_content_type :string(255)
#  attachment_file_size    :integer
#  attachment_updated_at   :datetime
#  category                :string(255)
#  created_at              :datetime
#  updated_at              :datetime
#

require 'spec_helper'

describe Attachment do

  describe '- Saves current user to attachment' do
    before(:each) do
      without_access_control do
        @user = FactoryGirl.create(:admin)
        set_current_user(@user, false)
        @attachment = FactoryGirl.create(:attachment)
      end
    end

    it '- Updates a new record with the current user' do
      without_access_control do
        expect(@attachment.user_id).to eq(@user.id)
      end
    end

    it '- Will not overwrite the user if it exists' do
      without_access_control do
        new_user = FactoryGirl.create(:buyer)
        @attachment.update(user: new_user)
        expect(@attachment.user_id).to_not eq(@user.id)
        expect(@attachment.user_id).to eq(new_user.id)
      end
    end
  end
end
