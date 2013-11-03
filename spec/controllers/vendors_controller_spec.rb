require 'spec_helper'
include AuthenticationHelpers

describe VendorsController, :type => :controller do

  it_behaves_like "a CRUD controller", { manager: :all,
                                         buyer: :all,
                                         receiver: :read,
                                         employee: :read,
                                         guest: :none
                                       },
                                       { name: 'John Sheridan' }

  before (:each) do
    without_access_control do
      @vend = FactoryGirl.create(:vendor)
    end
  end

  context "- It sends a JSON list of vendors" do
    PERMISSIONS = [:manager, :admin, :buyer]

    ROLES.each do |role|
      it "- As #{role}" do
        without_access_control do
          user = FactoryGirl.create(role)
          set_current_user user
        end

        get :token_request, { q: @vend.name }
        if PERMISSIONS.include? role
          response.should be_success
        else
          response.should_not be_success
        end
      end
    end
  end

  context "- Function tests" do
    before (:each) do
      without_access_control do
        set_current_user FactoryGirl.create(:admin)
      end
    end

    # Delete a vendor with a purchase
    it "- Cannot delete a vendor with purchases" do
      without_access_control do
        purchase = FactoryGirl.create(:purchase)
        purchase.vendors << @vend

        delete :destroy, id: @vend.id
        expect(response).to_not be_success
      end
    end
  end

end
