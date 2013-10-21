require 'spec_helper'
include AuthenticationHelpers

describe VendorsController, :type => :controller do

  it_behaves_like "a CRUD controller", { manager: :all,
                                         buyer: :all,
                                         receiver: :read,
                                         employee: :read,
                                         guest: :none
                                       },
                                       { name: 'John Sheridan' },
                                       [:show]

  before (:each) do
    @vend = FactoryGirl.create(:vendor)
  end

  context "- It sends a JSON list of vendors" do
    PERMISSIONS = [:manager, :admin, :buyer]

    ROLES.each do |role|
      it "- As #{role}" do
        user = FactoryGirl.create(role)
        set_current_user user

        get :token_request, { q: @vend.name }
        if PERMISSIONS.include? role
          response.should be_success
        else
          response.should_not be_success
        end
      end
    end
  end

end