require 'spec_helper'
include AuthenticationHelpers

describe UsersController do

  before (:each) do
    @vend = FactoryGirl.create(:user)
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
