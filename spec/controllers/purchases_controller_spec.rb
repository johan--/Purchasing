require 'spec_helper'
include AuthenticationHelpers

describe PurchasesController do

  it_behaves_like "a CRUD controller", { manager: :all,
                                         buyer: :all,
                                         receiver: :read,
                                         employee: :read,
                                         guest: :none
                                       },
                                       { tracking_num: '1Z12351jfwdadq2vad2' }
  # Test stars
  describe 'it toggles the star' do
    before (:each) do
      @record = FactoryGirl.create(:purchase)
    end

    context '- Can toggle the Star' do
      before (:each) do
        @user = FactoryGirl.create(:admin)
        set_current_user @user
      end

      it '- Toggles True to False' do
        @record.set_starred
        post :update_star, id: @record.id
        expect(response).to be_success
        expect(@record.reload.starred).to be_nil
      end

      it '- Toggles False to True' do
        # Default is false so don't toggle
        post :update_star, id: @record.id
        expect(response).to be_success
        expect(@record.reload.starred).to_not be_nil
      end
    end

    describe '- Fails if not authorized' do
      it '- Fails with :receiver' do
        set_current_user FactoryGirl.create(:receiver)
        post :update_star, id: @record.id
        expect(response).to_not be_success
      end

      it '- Fails with :employee' do
        set_current_user FactoryGirl.create(:employee)
        post :update_star, id: @record.id
        expect(response).to_not be_success
      end
    end
  end
  # Test receive_all

  # Test pagination?

  # Test filtering?
end
