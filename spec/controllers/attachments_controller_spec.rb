require 'spec_helper'
include AuthenticationHelpers
include ActionDispatch::TestProcess

#ActiveRecord::Base.logger = Logger.new(STDOUT) if defined?(ActiveRecord::Base)

describe AttachmentsController do

  { manager: :all,
    buyer: :all,
    receiver: :read,
    employee: :read,
    guest: :none
  }.each do |role, permission|

    describe "- Each CRUD method for #{role}" do
      before(:each) do
        without_access_control do
          @attachment = FactoryGirl.create(:attachment)
          @purchase = @attachment.purchase
          set_current_user FactoryGirl.create(role)
        end
      end

      it "- POST :create should be #{permission}" do
        post :create, purchase_id: @purchase.id, attachment: fixture_file_upload('../support/test.jpg', 'image/jpg')
        if permission == :all || permission == :create
          expect(response).to be_success
          expect(Attachment.count).to eq(2)
        else
          expect(response).to_not be_success
          expect(Attachment.count).to eq(1)
        end
      end

      it '- POST :create will fail without a file' do
        post :create, purchase_id: @purchase.id, file: nil
        expect(response).to_not be_success
      end

      it "- DELETE :destroy should be #{permission}" do
        delete :destroy, purchase_id: @purchase.id, id: @attachment.id
        if permission == :all || permission == :create
          expect(response).to be_success
          expect(Attachment.find_by(id: @attachment.id)).to be_nil
        else
          expect(response).to_not be_success
        end
      end
    end
  end

  # Fix since rspec destroy isn't triggeirng paperclip's cleanup
  after(:each) do
    without_access_control do
      Attachment.destroy_all
    end
  end
end
