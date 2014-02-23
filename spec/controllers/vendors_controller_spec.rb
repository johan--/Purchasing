require 'spec_helper'

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

        get :tokens, { q: @vend.name }
        if PERMISSIONS.include? role
          response.should be_success
        else
          response.should_not be_success
        end
      end
    end
  end

end
